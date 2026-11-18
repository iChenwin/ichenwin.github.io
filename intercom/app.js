/* 随声 — buildless, two-person WebRTC push-to-talk. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const ui = Object.fromEntries(['start', 'setup', 'session', 'status', 'hint', 'mode', 'connection', 'led', 'invite', 'inviteBox', 'copy', 'ptt', 'pttLabel', 'leave', 'remoteAudio', 'speaker', 'settings', 'settingsNote', 'turnUrl', 'turnUser', 'turnPassword', 'setupNote'].map(id => [id, $(id)]));
  const radio = document.querySelector('.radio');
  const inviteId = location.hash.slice(1);
  const target = /^ss-[a-f0-9]{32}$/.test(inviteId) ? inviteId : null;
  let epoch = 0, peer, data, call, stream, self, other, host = false;
  let mediaReady = false, pressed = false, floor = null, request = 0;
  let connectTimer, holdTimer, reconnectTimer, turn = null, busy = false;
  const clearTimers = () => { clearTimeout(connectTimer); clearTimeout(holdTimer); clearTimeout(reconnectTimer); };
  const say = (status, hint) => { ui.status.textContent = status; ui.hint.textContent = hint; };
  const mute = () => stream?.getAudioTracks().forEach(track => { track.enabled = false; });
  const send = message => { if (data?.open) data.send(message); };
  const connected = () => !!(mediaReady && data?.open);

  if (target) {
    ui.start.innerHTML = '加入频道 <span>↗</span>';
    say('有人邀请你对讲', '点击加入，允许麦克风后即可开始。');
  } else if (inviteId) {
    say('邀请链接无效', '你可以创建一个新频道，再分享给对方。');
  }

  function render() {
    const ready = connected(), mine = floor === self && ready, theirs = floor === other && !!other && ready;
    // No audio track is enabled until a held gesture AND a floor grant exist.
    stream?.getAudioTracks().forEach(track => { track.enabled = !!(mine && pressed); });
    ui.ptt.disabled = !ready || theirs;
    ui.ptt.setAttribute('aria-pressed', String(mine && pressed));
    radio.classList.toggle('talking', mine && pressed);
    radio.classList.toggle('receiving', theirs);
    ui.led.classList.toggle('on', ready);
    ui.connection.textContent = ready ? '● 已连接' : '○ 等待连接';
    ui.mode.textContent = mine ? '发射 TRANSMIT' : theirs ? '接收 RECEIVE' : ready ? '在线 ONLINE' : '待机 STANDBY';
    ui.pttLabel.textContent = mine && pressed ? '正在说话' : theirs ? '对方正在说话' : ready ? '按住说话' : '等待对方加入';
    if (ready) {
      clearTimeout(connectTimer);
      say(mine && pressed ? '你的声音，正在传送' : theirs ? '正在听见对方' : '已接通，随时说话', mine && pressed ? '松开按钮，交给对方说。' : theirs ? '等对方松开后，就轮到你。' : '按住按钮或空格键，开始对讲。');
    }
  }

  function reset() {
    ++epoch;
    clearTimers(); mute(); pressed = false; floor = null; mediaReady = false;
    // Invalidate callbacks before closing resources.
    const oldPeer = peer, oldData = data, oldCall = call;
    peer = data = call = null;
    oldCall?.close(); oldData?.close(); oldPeer?.destroy();
    stream?.getTracks().forEach(track => track.stop()); stream = null;
    ui.remoteAudio.pause(); ui.remoteAudio.srcObject = null;
    ui.speaker.hidden = true; self = other = null; busy = false;
    ui.setup.hidden = false; ui.session.hidden = true; ui.start.disabled = false;
    render();
  }

  function fail(message, hint = '检查网络和权限后，再试一次。') {
    reset(); say(message, hint);
  }

  function setFloor(owner, grantRequest) {
    if (!host) return;
    clearTimeout(holdTimer);
    floor = owner;
    send({ type: 'floor', owner, request: grantRequest });
    if (owner) holdTimer = setTimeout(() => { pressed = false; mute(); setFloor(null); }, 45000);
    render();
  }

  function release() {
    const wasPressed = pressed;
    pressed = false; mute();
    if (host && floor === self) setFloor(null);
    else if (!host && (wasPressed || floor === self)) {
      // Local release is immediate, even before the host receives it.
      if (floor === self) floor = null;
      send({ type: 'release', request });
    }
    render();
  }

  function press() {
    if (pressed || !connected() || (floor && floor !== self) || document.hidden) return;
    pressed = true; request++;
    playAudio();
    if (host) setFloor(self, request);
    else send({ type: 'request', request });
    render();
  }

  function playAudio() {
    if (!ui.remoteAudio.srcObject) return;
    ui.remoteAudio.play().then(() => { ui.speaker.hidden = true; }).catch(() => { ui.speaker.hidden = false; });
  }

  function bindCall(incoming, run) {
    call = incoming;
    incoming.on('stream', remote => {
      if (run !== epoch || incoming !== call) return;
      ui.remoteAudio.srcObject = remote; playAudio();
      const pc = incoming.peerConnection;
      const update = () => {
        if (run !== epoch || incoming !== call) return;
        const state = pc.connectionState;
        mediaReady = state === 'connected';
        if (!mediaReady) { release(); mute(); }
        if (state === 'failed' || state === 'closed') fail('语音连接已断开', '重新加入频道；跨网络连接失败可尝试配置 TURN。');
        else { render(); if (state === 'disconnected') say('连接暂时中断', '麦克风已静音，等待网络恢复。'); }
      };
      pc.addEventListener('connectionstatechange', update); update();
    });
    incoming.on('close', () => { if (run === epoch && incoming === call) fail('对方已结束通话', '重新创建或加入频道，即可继续。'); });
    incoming.on('error', () => { if (run === epoch && incoming === call) fail('语音连接失败', '检查网络，或在连接设置中配置 TURN 中继。'); });
  }

  function bindData(conn, run) {
    data = conn; other = conn.peer;
    conn.on('open', () => {
      if (run !== epoch || data !== conn) return;
      if (host) send({ type: 'ready' });
      render();
    });
    conn.on('data', message => {
      if (run !== epoch || data !== conn || !message || typeof message !== 'object') return;
      if (message.type === 'busy') { fail('频道已有两个人', '请让对方创建一个新频道，再向你分享链接。'); return; }
      if (!host && message.type === 'ready' && !call) {
        say('正在接通语音', '请稍候，正在建立加密音频连接。');
        bindCall(peer.call(other, stream), run);
      }
      if (host && message.type === 'request' && Number.isSafeInteger(message.request) && connected()) {
        if (!floor) setFloor(other, message.request);
        else send({ type: 'floor', owner: floor, request: message.request });
      }
      if (host && message.type === 'release' && floor === other) setFloor(null);
      if (!host && message.type === 'floor' && [null, self, other].includes(message.owner)) {
        floor = message.owner;
        if (floor === self && (!pressed || message.request !== request)) { floor = null; send({ type: 'release', request }); }
        render();
      }
    });
    conn.on('close', () => { if (run === epoch && data === conn) fail('对方已离开频道', '重新创建或加入频道，即可继续。'); });
    conn.on('error', () => { if (run === epoch && data === conn) fail('频道连接失败'); });
  }

  ui.start.addEventListener('click', async () => {
    if (busy) return;
    busy = true; ui.start.disabled = true;
    const run = ++epoch;
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) throw new Error('secure-context');
      if (!window.Peer) throw new Error('peer-library');
      say('正在开启麦克风', '请在浏览器提示中允许使用麦克风。');
      const acquired = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
      if (run !== epoch) { acquired.getTracks().forEach(track => track.stop()); return; }
      stream = acquired; mute();
      stream.getAudioTracks().forEach(track => track.addEventListener('ended', () => { if (run === epoch) fail('麦克风已断开', '请检查麦克风设备与浏览器权限，然后重试。'); }));
      host = !target;
      self = `ss-${crypto.randomUUID().replaceAll('-', '')}`;
      const iceServers = [{ urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] }];
      if (turn) iceServers.push(turn);
      peer = new Peer(self, { debug: 0, config: { iceServers } });
      ui.setup.hidden = true; ui.session.hidden = false; ui.inviteBox.hidden = !host;
      say('正在连接频道服务', '首次连接可能需要几秒钟。');
      connectTimer = setTimeout(() => { if (run === epoch) fail('连接超时', '确认双方页面保持打开；也可在连接设置中配置 TURN 后重试。'); }, 30000);
      peer.on('open', () => {
        if (run !== epoch) return;
        if (host) {
          clearTimeout(connectTimer);
          const url = new URL(location.href); url.hash = self;
          ui.invite.value = url.href;
          say('频道已就绪', '复制下方链接，发给另一台设备。');
        } else {
          say('正在寻找对方', '请确保创建频道的设备仍然打开页面。');
          bindData(peer.connect(target, { reliable: true, serialization: 'json' }), run);
        }
      });
      peer.on('connection', conn => {
        if (run !== epoch) { conn.close(); return; }
        if (!host || data) {
          conn.on('open', () => { conn.send({ type: 'busy' }); setTimeout(() => conn.close(), 500); });
          return;
        }
        bindData(conn, run);
        connectTimer = setTimeout(() => { if (run === epoch && !connected()) fail('语音连接超时', '双方可配置 TURN 中继后，重新创建频道。'); }, 30000);
        say('对方正在加入', '正在建立加密音频连接。');
      });
      peer.on('call', incoming => {
        if (run !== epoch || !host || call || incoming.peer !== other) { incoming.close(); return; }
        bindCall(incoming, run); incoming.answer(stream);
      });
      peer.on('disconnected', () => {
        if (run !== epoch) return;
        if (!connected()) say('频道服务暂时断开', '正在尝试重新连接。');
        reconnectTimer = setTimeout(() => { if (run === epoch && peer && !peer.destroyed) peer.reconnect(); }, 2000);
      });
      peer.on('error', error => {
        if (run !== epoch) return;
        if (connected() && ['network', 'server-error', 'socket-error', 'socket-closed'].includes(error.type)) return;
        fail(error.type === 'peer-unavailable' ? '对方不在线' : '无法连接频道', error.type === 'peer-unavailable' ? '邀请可能已过期，请让对方保持页面打开并分享新链接。' : '检查是否能访问 PeerJS 公共信令服务，然后重试。');
      });
    } catch (error) {
      if (run !== epoch) return;
      const messages = {
        NotAllowedError: ['没有麦克风权限', '请在浏览器的网站设置中允许麦克风，然后重试。'],
        NotFoundError: ['没有找到麦克风', '请连接一个麦克风，再创建或加入频道。'],
        NotReadableError: ['麦克风暂时不可用', '检查设备是否正常，或关闭占用麦克风的应用后重试。'],
        'secure-context': ['需要安全连接', '请使用 HTTPS 或 localhost 打开本页面。'],
        'peer-library': ['连接组件加载失败', '请刷新页面后重试。']
      };
      fail(...(messages[error.name] || messages[error.message] || ['启动失败', '请检查网络与麦克风后重试。']));
    }
  });

  ui.ptt.addEventListener('pointerdown', event => {
    if (event.button !== 0 || ui.ptt.disabled) return;
    event.preventDefault(); ui.ptt.setPointerCapture(event.pointerId); press();
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) ui.ptt.addEventListener(event, release);
  ui.ptt.addEventListener('contextmenu', event => event.preventDefault());
  window.addEventListener('keydown', event => {
    if (event.code !== 'Space' || event.repeat || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || (event.target.closest('button,summary,a') && event.target !== ui.ptt)) return;
    event.preventDefault(); press();
  });
  window.addEventListener('keyup', event => { if (event.code === 'Space') release(); });
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', () => { if (document.hidden) release(); });
  window.addEventListener('pagehide', reset);
  ui.leave.addEventListener('click', () => { reset(); say('频道已结束', '麦克风已关闭，可以随时再次开始。'); });
  ui.speaker.addEventListener('click', playAudio);
  ui.copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(ui.invite.value); ui.copy.textContent = '已复制 ✓'; setTimeout(() => { ui.copy.textContent = '复制链接'; }, 2000); }
    catch { ui.invite.focus(); ui.invite.select(); say('请手动复制链接', '已选中邀请链接，复制后发送给另一台设备。'); }
  });
  ui.settings.addEventListener('submit', event => {
    event.preventDefault();
    const urls = ui.turnUrl.value.trim();
    if (urls && !/^turns?:[^\s]+$/i.test(urls)) { ui.settingsNote.textContent = '请输入以 turn: 或 turns: 开头的有效地址。'; return; }
    turn = urls ? { urls, username: ui.turnUser.value.trim(), credential: ui.turnPassword.value } : null;
    ui.settingsNote.textContent = turn ? '已应用。请在双方设备配置，然后重新创建 / 加入频道。' : '已恢复默认 STUN 连接。刷新会清除内存中的凭据。';
  });
})();
