import * as T from "./vendor/three.module.js";
import { createSwimmer } from "./swimmer.js";
const $ = (id) => document.getElementById(id),
  clamp = T.MathUtils.clamp,
  lerp = T.MathUtils.lerp;
const cities = [
  {
    name: "重庆",
    title: "山城江湾",
    desc: "群山之间，万家灯火。",
    coord: "29°33′ N / 106°35′ E",
    hill: 100,
    tint: 0x60857a,
    kind: 0,
  },
  {
    name: "宜昌",
    title: "峡口清风",
    desc: "青山相对，江水穿峡而来。",
    coord: "30°41′ N / 111°17′ E",
    hill: 150,
    tint: 0x73937b,
    kind: 1,
  },
  {
    name: "武汉",
    title: "江城晚照",
    desc: "黄鹤楼前，听见两江的风。",
    coord: "30°35′ N / 114°18′ E",
    hill: 35,
    tint: 0x7f9382,
    kind: 2,
  },
  {
    name: "南京",
    title: "金陵烟水",
    desc: "一江烟水，半城青绿。",
    coord: "32°04′ N / 118°44′ E",
    hill: 50,
    tint: 0x879481,
    kind: 3,
  },
  {
    name: "上海",
    title: "入海之处",
    desc: "城市醒来，江流奔向辽阔。",
    coord: "31°14′ N / 121°29′ E",
    hill: 15,
    tint: 0x7d9590,
    kind: 4,
  },
];
let renderer;
try {
  renderer = new T.WebGLRenderer({
    canvas: $("world"),
    antialias: true,
    powerPreference: "high-performance",
  });
} catch (e) {
  $("error").textContent =
    "当前浏览器无法启动 WebGL 2，请用支持硬件加速的浏览器打开。";
  $("error").classList.remove("hidden");
  throw e;
}
const coarse = matchMedia("(pointer:coarse)").matches;
let renderRatio = Math.min(devicePixelRatio, coarse ? 1.35 : 1.8);
renderer.setPixelRatio(renderRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
const scene = new T.Scene(),
  camera = new T.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 2000);
const fogColor = new T.Color(0xaec6b1);
scene.background = fogColor.clone();
scene.fog = new T.FogExp2(fogColor, 0.0019);
const hemi = new T.HemisphereLight(0xe9f1d0, 0x1c5558, 2.6);
scene.add(hemi);
const sunLight = new T.DirectionalLight(0xffdf9b, 3.5);
sunLight.position.set(140, 100, -250);
scene.add(sunLight);
let seed = 8;
function rand() {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const geo = {
  box: new T.BoxGeometry(1, 1, 1),
  sphere: new T.SphereGeometry(1, 16, 12),
  cone: new T.ConeGeometry(1, 1, 8),
  cyl: new T.CylinderGeometry(1, 1, 1, 10),
};
const mats = {};
function mat(c, rough = 0.85) {
  const key = c + "-" + rough;
  return (mats[key] ??= new T.MeshStandardMaterial({
    color: c,
    roughness: rough,
  }));
}
function mesh(g, m, parent, pos = [0, 0, 0], scale = [1, 1, 1]) {
  const o = new T.Mesh(g, m);
  o.position.set(...pos);
  o.scale.set(...scale);
  parent.add(o);
  return o;
}
function box(parent, c, x, y, z, sx, sy, sz) {
  return mesh(geo.box, mat(c), parent, [x, y, z], [sx, sy, sz]);
}
function ball(parent, c, x, y, z, sx, sy, sz) {
  return mesh(geo.sphere, mat(c), parent, [x, y, z], [sx, sy, sz]);
}
function rod(parent, a, b, r, c) {
  const d = new T.Vector3().subVectors(b, a),
    o = mesh(
      geo.cyl,
      mat(c),
      parent,
      a.clone().add(b).multiplyScalar(0.5).toArray(),
      [r, d.length(), r],
    );
  o.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize());
  return o;
}
const sky = new T.Mesh(
  new T.SphereGeometry(1300, 32, 18),
  new T.ShaderMaterial({
    side: T.BackSide,
    uniforms: { night: { value: 0 } },
    vertexShader:
      "varying vec3 v; void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: `varying vec3 v;uniform float night;void main(){float h=normalize(v).y;vec3 c=mix(vec3(.78,.81,.64),vec3(.18,.43,.46),smoothstep(-.1,.9,h));c=mix(c,vec3(.045,.105,.18)+h*.03,night);gl_FragColor=vec4(c,1.);}`,
  }),
);
scene.add(sky);
const sun = mesh(
  geo.sphere,
  new T.MeshBasicMaterial({ color: 0xffe4a3 }),
  scene,
  [180, 92, -620],
  [23, 23, 23],
);
const terrain = new T.Group();
scene.add(terrain);
const fauna = new T.Group();
scene.add(fauna);
const waterUniforms = {
  time: { value: 0 },
  eye: { value: new T.Vector3() },
  night: { value: 0 },
  under: { value: 0 },
  player: { value: new T.Vector2() },
};
const waveGLSL = `float wave(vec2 p){return sin(p.x*.19+p.y*.13+time*1.1)*.075+sin(p.x*.37-p.y*.21+time*1.6)*.045+sin(p.x*.08+p.y*.07-time*.7)*.12;}`;
const waterMat = new T.ShaderMaterial({
  uniforms: waterUniforms,
  side: T.DoubleSide,
  transparent: true,
  depthWrite: false,
  vertexShader: `uniform float time;varying vec3 world;${waveGLSL}void main(){vec3 p=position;vec4 base=modelMatrix*vec4(p,1.);p.z+=wave(base.xz);vec4 w=modelMatrix*vec4(p,1.);world=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
  fragmentShader: `uniform float time;uniform float night;uniform float under;uniform vec3 eye;uniform vec2 player;varying vec3 world;${waveGLSL}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){vec2 p=world.xz;float e=.15;vec3 n=normalize(vec3((wave(p-vec2(e,0))-wave(p+vec2(e,0)))/(.3),1.,(wave(p-vec2(0,e))-wave(p+vec2(0,e)))/(.3)));n.xz+=(noise(p*1.9+time*.3)-.5)*.16;vec3 v=normalize(eye-world);float f=pow(1.-abs(dot(v,n)),3.);vec3 c=mix(vec3(.055,.25,.24),vec3(.44,.63,.54),f);float glint=pow(max(dot(reflect(-normalize(vec3(.35,.3,-.9)),n),v),0.),110.);c+=vec3(1.,.86,.57)*glint*.95;float strands=pow(max(0.,sin(p.x*1.6+sin(p.y*.5+time)*2.+time)),24.)*.05;c+=strands;float wake=exp(-abs(p.x-player.x)*1.4)*exp(-abs(p.y-player.y-2.)*.3)*step(player.y,p.y);c+=wake*noise(p*4.-time)*.15;c=mix(c,vec3(.025,.09,.14)+c*.25,night);float fog=1.-exp(-length(eye-world)*.0018);c=mix(c,mix(vec3(.68,.76,.63),vec3(.04,.1,.16),night),fog);gl_FragColor=vec4(c,under>.5?.35:.89);}`,
});
const water = new T.Mesh(
  new T.PlaneGeometry(1500, 1900, coarse ? 100 : 180, coarse ? 130 : 220),
  waterMat,
);
water.rotation.x = -Math.PI / 2;
water.position.z = -500;
scene.add(water);
const bed = box(scene, 0x366f62, 0, -9, -500, 1500, 1, 1900);
const bedShader = new T.ShaderMaterial({
  uniforms: { time: { value: 0 } },
  vertexShader:
    "varying vec3 w;void main(){w=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
  fragmentShader:
    "uniform float time;varying vec3 w;void main(){vec2 p=w.xz;float v=sin(p.x*.7+sin(p.y*.5+time*.4))+sin(p.y*.8+sin(p.x*.5-time*.3));float c=pow(1.-abs(v)*.5,12.);gl_FragColor=vec4(vec3(.11,.31,.27)+max(c,0.)*.10,1.);}",
});
bed.material = bedShader;
let bridges = [],
  fish = [],
  birds = [],
  rings = [],
  porpoises = [],
  collected = 0,
  city = 0,
  elapsed = 0,
  distance = 0,
  energy = 100,
  speed = 0,
  px = 0,
  pz = 100,
  phase = 0,
  started = false,
  paused = false,
  diving = false,
  view = 0,
  stroke = 0,
  night = 0,
  targetNight = 0;
const keys = {};
function mountain(x, z, w, h, d, c) {
  const g = new T.PlaneGeometry(w, d, 16, 22);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) / w + 0.5,
      v = p.getZ(i) / d + 0.5;
    const edge = Math.pow(
      Math.max(0, Math.sin(Math.PI * u) * Math.sin(Math.PI * v)),
      0.85,
    );
    p.setY(
      i,
      Math.max(
        -1,
        edge *
          (h *
            (0.75 +
              0.13 * Math.sin(u * 13 + v * 8) +
              0.1 * Math.sin(v * 19 - u * 7))),
      ),
    );
  }
  g.computeVertexNormals();
  const m = new T.Mesh(g, mat(c));
  m.position.set(x, -2, z);
  terrain.add(m);
}
function pagoda(x, z) {
  const g = new T.Group();
  g.position.set(x, 9, z);
  terrain.add(g);
  for (let i = 0; i < 5; i++) {
    box(g, 0xbba278, 0, i * 6 + 3, 0, 16 - i * 2, 5, 13 - i * 1.5);
    const roof = mesh(
      geo.cone,
      mat(0x37585a),
      g,
      [0, i * 6 + 7, 0],
      [16 - i * 2, 5, 14 - i * 1.6],
    );
    roof.rotation.y = Math.PI / 4;
  }
  rod(g, new T.Vector3(0, 32, 0), new T.Vector3(0, 39, 0), 0.35, 0xd4b578);
}
function bridge(z, kind) {
  const g = new T.Group();
  terrain.add(g);
  box(g, 0x899e89, 0, 22, z, 370, 3, 9);
  for (const x of [-110, 110]) {
    box(g, 0x8b9d8e, x, 31, z, 5, 64, 5);
    box(g, 0x9dae99, x, 58, z, 25, 3, 5);
    for (let j = -5; j <= 5; j++) {
      const end = x + j * 17;
      rod(
        g,
        new T.Vector3(x, 59, z),
        new T.Vector3(end, 24, z),
        0.24,
        0xc9c5a3,
      );
    }
  }
  bridges.push(g);
}
function buildCity(index) {
  seed = 18 + index * 173;
  for (const o of [...terrain.children]) {
    terrain.remove(o);
    if (o.isInstancedMesh) o.dispose();
    o.traverse((v) => {
      if (v.geometry && !Object.values(geo).includes(v.geometry))
        v.geometry.dispose();
    });
  }
  bridges = [];
  const data = cities[index];
  for (let side of [-1, 1]) {
    box(terrain, 0x537e66, side * 355, -2, -450, 430, 8, 1800);
    for (let i = 0; i < 11; i++)
      mountain(
        side * (420 + rand() * 160),
        100 - i * 110,
        260 + rand() * 120,
        data.hill * (0.7 + rand() * 0.8),
        230 + rand() * 160,
        data.tint,
      );
    for (let i = 0; i < 85; i++) {
      const x = side * (155 + rand() * 150),
        z = 200 - rand() * 1500;
      const urban = index === 1 ? rand() > 0.75 : true;
      if (urban) {
        const h =
          9 +
          Math.pow(rand(), 2) * (index === 0 ? 105 : index === 4 ? 140 : 55);
        const w = 7 + rand() * 15,
          depth = 9 + rand() * 14;
        const c = new T.Color().setHSL(
          0.39 + rand() * 0.07,
          0.1,
          0.35 + rand() * 0.23,
        );
        box(terrain, c.getHex(), x, h / 2 + 2, z, w, h, depth);
        if (h > 35) {
          box(terrain, 0xa4b09c, x, h + 3, z, w * 0.55, 6, depth * 0.6);
          rod(
            terrain,
            new T.Vector3(x, h + 6, z),
            new T.Vector3(x, h + 12, z),
            0.12,
            0x8ea394,
          );
        }
        for (let j = 0; j < Math.min(8, h / 7); j++) {
          for (let col = -1; col <= 1; col++) {
            box(
              terrain,
              0xc1c4a0,
              x + col * w * 0.27,
              h * 0.15 + j * 6,
              z + depth / 2 + 0.03,
              w * 0.11,
              1.7,
              0.07,
            );
          }
        }
      }
    }
    for (let i = 0; i < 110; i++) {
      const x = side * (146 + rand() * 110),
        z = 240 - rand() * 1600,
        h = 4 + rand() * 8;
      box(terrain, 0x4d6756, x, h / 2, z, 0.65, h, 0.65);
      ball(
        terrain,
        rand() > 0.5 ? 0x3f715c : 0x527c5b,
        x,
        h,
        z,
        3 + rand() * 3,
        4 + rand() * 3,
        3 + rand() * 3,
      );
    }
  }
  // River edge: stone quays and small human-scale details in the cities.
  for (const side of [-1, 1]) {
    if (index !== 1) {
      box(terrain, 0x778e81, side * 140, 0.1, -470, 4, 4, 1660);
      box(terrain, 0xa7ac92, side * 145, 2, -470, 7, 0.6, 1660);
      for (let j = 0; j < 27; j++) {
        const z = 220 - j * 60;
        rod(
          terrain,
          new T.Vector3(side * 141, 2, z),
          new T.Vector3(side * 141, 7, z),
          0.11,
          0x3f6664,
        );
        ball(terrain, 0xe0d7b0, side * 141, 7, z, 0.4, 0.4, 0.4);
        for (let k = 0; k < 3; k++)
          box(
            terrain,
            0x94a08d,
            side * (148 + k * 2),
            1 - k * 0.3,
            z - 18,
            2,
            0.4,
            12,
          );
      }
    } else {
      for (let j = 0; j < 35; j++) {
        const z = 200 - j * 40;
        const rock = ball(
          terrain,
          0x71918b,
          side * (137 + rand() * 12),
          0.2,
          z,
          2 + rand() * 3,
          1.3 + rand() * 2,
          3 + rand() * 3,
        );
        rock.rotation.z = rand() * 0.4;
      }
    }
  }
  if (index !== 1) bridge(-310, index);
  if (index === 2 || index === 3) pagoda(-178, -155);
  if (index === 4) {
    const g = new T.Group();
    g.position.set(205, 0, -180);
    terrain.add(g);
    rod(g, new T.Vector3(0, 0, 0), new T.Vector3(0, 162, 0), 1.7, 0xa5aaa0);
    ball(g, 0xb78e83, 0, 52, 0, 12, 12, 12);
    ball(g, 0xb78e83, 0, 116, 0, 8, 8, 8);
    box(g, 0x709697, 35, 90, -25, 16, 180, 16);
  }
  // A few slow riverboats: hulls and cabins are ordinary parametric solids.
  for (let i = 0; i < 4; i++) {
    const x = (i % 2 ? 1 : -1) * (70 + rand() * 40),
      z = -180 - i * 230;
    box(terrain, 0x5d7270, x, 1.2, z, 10, 3, 26);
    box(terrain, 0xd3d2b6, x, 4, z + 4, 7, 4, 9);
    box(terrain, 0xa8b4a3, x, 7, z + 5, 8, 1, 11);
  }
  // Batch repeated solids into GPU instances; keep unique mountain meshes separate.
  terrain.updateMatrixWorld(true);
  const batches = new Map();
  terrain.traverse((o) => {
    if (o.isMesh && Object.values(geo).includes(o.geometry)) {
      const key = o.geometry.uuid + o.material.uuid;
      let b = batches.get(key);
      if (!b) {
        b = { geometry: o.geometry, material: o.material, items: [] };
        batches.set(key, b);
      }
      b.items.push({ o, matrix: o.matrixWorld.clone() });
    }
  });
  for (const b of batches.values()) {
    const inst = new T.InstancedMesh(b.geometry, b.material, b.items.length);
    b.items.forEach((item, i) => {
      inst.setMatrixAt(i, item.matrix);
      item.o.removeFromParent();
    });
    inst.instanceMatrix.needsUpdate = true;
    terrain.add(inst);
  }
  for (const r of rings) {
    scene.remove(r.group);
    r.group.traverse((o) => {
      if (o.geometry && !Object.values(geo).includes(o.geometry))
        o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
  }
  rings = [];
  for (let i = 0; i < 3; i++) {
    const g = new T.Group();
    g.position.set([0, -15, 20][i], i === 1 ? -2.3 : 1.4, 15 - i * 220);
    scene.add(g);
    const ring = mesh(
      new T.TorusGeometry(3, 0.09, 8, 64),
      new T.MeshBasicMaterial({ color: 0xe6efb0 }),
      g,
    );
    const core = mesh(
      new T.OctahedronGeometry(0.45),
      new T.MeshBasicMaterial({ color: 0xe8f2ae }),
      g,
    );
    rings.push({ group: g, ring, core, got: false });
  }
  $("cityName").textContent = data.name;
  $("segment").textContent = `0${index + 1} / ${data.title}`;
  $("cityDesc").textContent = data.desc;
  $("coordinate").textContent = data.coord;
  $("locationText").textContent = data.name + " · " + data.title;
  document
    .querySelectorAll(".route button")
    .forEach((b, i) => b.classList.toggle("active", i === index));
}
// Fish bodies, fins and tails are generated at startup, with no model files.
for (let i = 0; i < 48; i++) {
  const g = new T.Group();
  fauna.add(g);
  const c = [0xabc1a0, 0x729e99, 0xc5bd8b][i % 3];
  ball(g, c, 0, 0, 0, 0.18, 0.3, 0.7);
  const tail = mesh(geo.cone, mat(c), g, [0, 0, 0.85], [0.37, 0.55, 0.09]);
  tail.rotation.x = Math.PI / 2;
  const fin = mesh(geo.cone, mat(c), g, [0, 0.3, 0.1], [0.08, 0.3, 0.3]);
  ball(g, 0x192f32, -0.13, 0.1, -0.4, 0.04, 0.04, 0.04);
  g.scale.setScalar(1.3);
  fish.push({
    g,
    tail,
    offset: rand() * 300,
    lane: (rand() - 0.5) * 130,
    depth: 1 + rand() * 5,
    s: rand() * 6,
  });
}
for (let i = 0; i < 3; i++) {
  const g = new T.Group();
  fauna.add(g);
  ball(g, 0x829d97, 0, 0, 0, 0.48, 0.45, 1.3);
  ball(g, 0x91aaa1, 0, 0.08, -1, 0.36, 0.32, 0.48);
  for (let s of [-1, 1]) {
    const f = ball(g, 0x78958e, s * 0.5, -0.18, 0.2, 0.5, 0.08, 0.22);
    f.rotation.z = s * 0.3;
  }
  const tail = ball(g, 0x698e87, 0, 0, 1.5, 0.65, 0.1, 0.32);
  ball(g, 0x142d30, -0.3, 0.18, -1, 0.045, 0.045, 0.045);
  ball(g, 0x142d30, 0.3, 0.18, -1, 0.045, 0.045, 0.045);
  porpoises.push({ g, tail, offset: i * 115 });
}
for (let i = 0; i < 14; i++) {
  const g = new T.Group();
  scene.add(g);
  const wings = [];
  for (let s of [-1, 1]) {
    const p = new T.Group();
    g.add(p);
    ball(p, 0xe0e2c8, s * 0.9, 0, 0, 1.2, 0.06, 0.28);
    wings.push(p);
  }
  birds.push({ g, wings, offset: rand() * 600 });
}
// Joint trajectories and fixed-length two-bone IK are implemented in swimmer.js.
const avatar = createSwimmer(),
  swimmer = avatar.root;
scene.add(swimmer);
const dropCount = 160,
  dropPositions = new Float32Array(dropCount * 3),
  dropVelocity = new Float32Array(dropCount * 3),
  dropLife = new Float32Array(dropCount);
dropPositions.fill(10000);
const dropGeometry = new T.BufferGeometry();
dropGeometry.setAttribute("position", new T.BufferAttribute(dropPositions, 3));
const drops = new T.Points(
  dropGeometry,
  new T.PointsMaterial({
    color: 0xe2eee0,
    size: 0.045,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  }),
);
drops.frustumCulled = false;
scene.add(drops);
let nextDrop = 0;
function emitSplash(p) {
  for (let k = 0; k < 12; k++) {
    const i = nextDrop++ % dropCount;
    dropPositions.set([p.x, p.y + 0.06, p.z], i * 3);
    dropVelocity.set(
      [
        (Math.random() - 0.5) * 1.2,
        0.4 + Math.random() * 1.1,
        (Math.random() - 0.5) * 1.2,
      ],
      i * 3,
    );
    dropLife[i] = 0.3 + Math.random() * 0.4;
  }
}
const ripples = [];
for (let i = 0; i < 18; i++) {
  const m = new T.Mesh(
    new T.RingGeometry(0.45, 0.465, 40),
    new T.MeshBasicMaterial({
      color: 0xc7e3c8,
      transparent: true,
      opacity: 0.4,
      side: T.DoubleSide,
      depthWrite: false,
    }),
  );
  m.rotation.x = -Math.PI / 2;
  scene.add(m);
  ripples.push({ m, age: i / 5 });
}
const routes = $("route");
cities.forEach((c, i) => {
  const b = document.createElement("button");
  b.textContent = c.name;
  b.title = "前往" + c.name;
  b.onclick = () => goCity(i);
  routes.appendChild(b);
});
let toastTimer;
function toast(s) {
  $("toast").textContent = s;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 4200);
}
function goCity(i) {
  city = i;
  distance = 0;
  pz = 100;
  px = 0;
  collected = 0;
  energy = 100;
  buildCity(i);
  if (started) {
    camera.position.set(1.3, diving ? -1.5 : 2.8, pz + 5.7);
    closeMenu();
    toast("抵达" + cities[i].name + " · " + cities[i].title);
  }
}
let audioCtx,
  master,
  waterGain,
  filter,
  musicTimer,
  soundOn = false,
  lastSplash = 0;
function initAudio() {
  if (audioCtx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) {
    toast("此浏览器暂不支持合成音频");
    return;
  }
  audioCtx = new AC();
  master = audioCtx.createGain();
  master.gain.value = 0;
  master.connect(audioCtx.destination);
  const buffer = audioCtx.createBuffer(
      1,
      audioCtx.sampleRate * 3,
      audioCtx.sampleRate,
    ),
    a = buffer.getChannelData(0);
  let prev = 0;
  for (let i = 0; i < a.length; i++) {
    prev = (prev + (Math.random() * 2 - 1) * 0.035) / 1.025;
    a[i] = prev * 4;
  }
  const n = audioCtx.createBufferSource();
  n.buffer = buffer;
  n.loop = true;
  filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 650;
  waterGain = audioCtx.createGain();
  waterGain.gain.value = 0.18;
  n.connect(filter).connect(waterGain).connect(master);
  n.start();
  let note = 0;
  musicTimer = setInterval(() => {
    if (!soundOn || paused) return;
    const o = audioCtx.createOscillator(),
      g = audioCtx.createGain(),
      t = audioCtx.currentTime;
    o.type = "sine";
    o.frequency.value = [146.83, 220, 293.66, 329.63, 440, 293.66, 220, 196][
      note++ % 8
    ];
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.035, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, t + 3);
    o.connect(g).connect(master);
    o.start();
    o.stop(t + 3.1);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }, 1900);
}
function toggleSound() {
  initAudio();
  if (!audioCtx) return;
  audioCtx.resume();
  soundOn = !soundOn;
  master.gain.setTargetAtTime(
    soundOn && !paused ? 0.65 : 0,
    audioCtx.currentTime,
    0.3,
  );
  $("sound").textContent = "声音 " + (soundOn ? "开" : "关");
}
function splash() {
  if (!audioCtx || !soundOn) return;
  const t = audioCtx.currentTime;
  waterGain.gain.cancelScheduledValues(t);
  waterGain.gain.setValueAtTime(0.5, t);
  waterGain.gain.exponentialRampToValueAtTime(0.18, t + 0.5);
}
const gesture = {
  id: null,
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  steer: 0,
  push: 0,
  moved: false,
};
let lastTap = 0,
  exhausted = false;
function resetGesture() {
  gesture.id = null;
  gesture.steer = 0;
  gesture.push = 0;
  $("joystick").classList.remove("active");
  Object.keys(keys).forEach((k) => (keys[k] = false));
}
function start() {
  if (started) return;
  started = true;
  document.body.classList.add("playing");
  $("intro").classList.add("hidden");
  $("introFooter").classList.add("hidden");
  $("hud").classList.remove("hidden");
  $("controls").classList.remove("hidden");
  if (!soundOn) toggleSound();
  $("world").focus({ preventScroll: true });
  toast(
    coarse || innerWidth < 600
      ? "已自动前游 · 拖动转向，上推加速"
      : "已自动前游 · A / D 转向，W 加速",
  );
  setTimeout(() => $("gestureHint").classList.add("fade"), 11000);
}
function setPause(v) {
  paused = v;
  if (master)
    master.gain.setTargetAtTime(
      soundOn && !v ? 0.65 : 0,
      audioCtx.currentTime,
      0.2,
    );
}
function openMenu() {
  resetGesture();
  setPause(true);
  $("resume").textContent = started ? "继续漫游 ↗" : "开始漫游 ↗";
  if (!$("menu").open) $("menu").showModal();
}
function closeMenu() {
  if ($("menu").open) $("menu").close();
  setPause(false);
  if (started) $("world").focus({ preventScroll: true });
}
function changeStroke() {
  stroke = (stroke + 1) % 3;
  $("strokeName").textContent = ["自由泳", "蛙泳", "仰泳"][stroke];
  $("stroke").title = "切换游姿 · " + ["自由泳", "蛙泳", "仰泳"][stroke];
  toast(
    [
      "自由泳 · 入水、抱水、推水与高肘回臂",
      "蛙泳 · 抱水前伸，收腿蹬夹",
      "仰泳 · 双臂交替，随水轻轻转体",
    ][stroke],
  );
}
function toggleDive() {
  diving = !diving;
  $("diveLabel").textContent = diving ? "上浮" : "潜水";
  $("dive").setAttribute("aria-label", diving ? "返回水面" : "潜入水下");
  $("dive").classList.toggle("underwater", diving);
  toast(diving ? "潜入江中 · 看鱼群从身边游过" : "浮出水面 · 一起呼吸");
}
function changeView() {
  view = (view + 1) % 3;
  $("view").textContent = "视角 · " + ["跟随", "贴水", "俯瞰"][view];
}
$("start").onclick = start;
$("sound").onclick = toggleSound;
$("pause").onclick = openMenu;
$("closeMenu").onclick = closeMenu;
$("resume").onclick = () => {
  closeMenu();
  start();
};
$("stroke").onclick = changeStroke;
$("view").onclick = changeView;
$("dive").onclick = toggleDive;
$("day").onclick = () => {
  targetNight = targetNight ? 0 : 1;
  $("day").textContent = "天色 · " + (targetNight ? "月夜" : "日暮");
};
$("about").onclick = () => {
  openMenu();
  $("menu").querySelector("details").open = true;
};
$("menu").addEventListener("cancel", (e) => {
  e.preventDefault();
  closeMenu();
});
$("menu").addEventListener("click", (e) => {
  if (e.target === $("menu")) {
    const r = $("menu").getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      closeMenu();
  }
});
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if ($("menu").open) {
    if (k === "p") {
      e.preventDefault();
      closeMenu();
    }
    return;
  }
  if (e.target.tagName === "BUTTON" && ["Enter", " "].includes(e.key)) return;
  if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
    e.preventDefault();
  keys[k] = true;
  if (e.repeat) return;
  if (k === "enter" && !started) start();
  if (k === "p" || k === "escape") openMenu();
  if (k === "e") changeStroke();
  if (k === "v") changeView();
  if (k === " ") toggleDive();
  if (k === "m") toggleSound();
});
window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));
const canvas = $("world");
canvas.addEventListener("pointerdown", (e) => {
  if (!started || paused || gesture.id !== null) return;
  e.preventDefault();
  gesture.id = e.pointerId;
  gesture.x = e.clientX;
  gesture.y = e.clientY;
  gesture.dx = gesture.dy = 0;
  gesture.moved = false;
  canvas.setPointerCapture(e.pointerId);
  $("joystick").style.left = e.clientX + "px";
  $("joystick").style.top = e.clientY + "px";
  $("joystick").classList.add("active");
  $("joystick").firstElementChild.style.transform = "translate(0,0)";
});
canvas.addEventListener("pointermove", (e) => {
  if (e.pointerId !== gesture.id) return;
  gesture.dx = e.clientX - gesture.x;
  gesture.dy = e.clientY - gesture.y;
  gesture.steer = clamp(gesture.dx / 65, -1, 1);
  gesture.push = clamp(-gesture.dy / 85, 0, 1);
  if (Math.hypot(gesture.dx, gesture.dy) > 12) gesture.moved = true;
  $("joystick").firstElementChild.style.transform =
    `translate(${clamp(gesture.dx, -38, 38)}px,${clamp(gesture.dy, -38, 38)}px)`;
});
function releasePointer(e) {
  if (e.pointerId !== gesture.id) return;
  const tap = !gesture.moved && e.type === "pointerup",
    now = performance.now();
  if (tap && lastTap && now - lastTap < 320) {
    toggleDive();
    lastTap = 0;
  } else if (tap) lastTap = now;
  else lastTap = 0;
  resetGesture();
}
for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
  canvas.addEventListener(event, releasePointer);
canvas.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    resetGesture();
    if (started) openMenu();
  }
});
window.addEventListener("blur", () => {
  resetGesture();
  if (started) openMenu();
});
function resize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = innerWidth < innerHeight ? 56 : 50;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();
canvas.addEventListener("webglcontextlost", (e) => {
  e.preventDefault();
  setPause(true);
  $("error").textContent = "图形渲染暂时中断，请刷新页面继续。";
  $("error").classList.remove("hidden");
});
buildCity(0);
camera.position.set(24, 9, 125);
camera.lookAt(0, 3, -90);
let last = performance.now(),
  hudTime = 0,
  slowFrames = 0;
const desired = new T.Vector3(),
  look = new T.Vector3();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  if (paused) {
    return;
  }
  if (dt > 0.035) slowFrames++;
  else slowFrames = Math.max(0, slowFrames - 1);
  if (slowFrames > 90 && renderRatio > 1) {
    renderRatio = Math.max(1, renderRatio - 0.2);
    renderer.setPixelRatio(renderRatio);
    slowFrames = 0;
  }
  elapsed += dt;
  night = lerp(night, targetNight, dt * 0.6);
  sky.material.uniforms.night.value = night;
  sky.position.copy(camera.position);
  sun.material.color.setHex(night > 0.5 ? 0xe0ead1 : 0xffe4a3);
  sun.scale.setScalar(night > 0.5 ? 14 : 23);
  hemi.intensity = lerp(2.6, 0.55, night);
  sunLight.intensity = lerp(3.5, 0.5, night);
  scene.background.setHex(diving ? 0x1b6262 : 0xaec6b1);
  fogColor.setHex(diving ? 0x1b6262 : night > 0.5 ? 0x152f40 : 0xaec6b1);
  scene.fog.color.copy(fogColor);
  scene.fog.density = diving ? 0.032 : 0.0019;
  const moving = started && !keys.s && !keys.arrowdown;
  if (energy < 4) exhausted = true;
  else if (energy > 24) exhausted = false;
  const sprintRequested = keys.shift || gesture.push > 0.64,
    sprinting = moving && sprintRequested && !exhausted;
  const accelerating = keys.w || keys.arrowup || gesture.push > 0.15;
  const target = started
    ? moving
      ? sprinting
        ? 4.5
        : accelerating
          ? [2.8, 2.25, 2.45][stroke]
          : [1.85, 1.5, 1.65][stroke]
      : 0.4
    : 0.15;
  speed = lerp(speed, target, 1 - Math.exp(-dt * 1.6));
  let direction = 0;
  if (started) {
    energy = clamp(
      energy + dt * (sprinting ? -12 : accelerating ? 2 : 6),
      0,
      100,
    );
    direction = clamp(
      (keys.d || keys.arrowright ? 1 : 0) -
        (keys.a || keys.arrowleft ? 1 : 0) +
        gesture.steer,
      -1,
      1,
    );
    px = clamp(px + direction * dt * (2.4 + speed * 0.65), -130, 130);
    const step = speed * dt;
    pz -= step;
    distance += step;
    if (distance >= 800) goCity((city + 1) % 5);
    phase += dt * (moving ? (sprinting ? 4.9 : accelerating ? 3.9 : 3.1) : 1.3);
    swimmer.rotation.y = T.MathUtils.damp(
      swimmer.rotation.y,
      -direction * 0.32,
      3.5,
      dt,
    );
  } else phase += dt * 2.4;
  const surface =
    Math.sin(px * 0.19 + pz * 0.13 + elapsed * 1.1) * 0.075 +
    Math.sin(px * 0.37 - pz * 0.21 + elapsed * 1.6) * 0.045 +
    Math.sin(px * 0.08 + pz * 0.07 - elapsed * 0.7) * 0.12;
  const sy = diving ? -2.4 : surface + 0.1;
  swimmer.position.set(px, T.MathUtils.damp(swimmer.position.y, sy, 3, dt), pz);
  const entries = avatar.update(
    phase,
    stroke,
    moving ? 1 : 0.15,
    direction,
    dt,
  );
  if (!diving)
    for (const p of entries) {
      emitSplash(p);
      if (moving) splash();
    }
  for (let i = 0; i < dropCount; i++) {
    if (dropLife[i] > 0) {
      dropLife[i] -= dt;
      dropVelocity[i * 3 + 1] -= dt * 3.6;
      for (let j = 0; j < 3; j++)
        dropPositions[i * 3 + j] += dropVelocity[i * 3 + j] * dt;
    } else dropPositions[i * 3 + 1] = -1000;
  }
  dropGeometry.attributes.position.needsUpdate = true;
  for (let i = 0; i < ripples.length; i++) {
    const r = ripples[i];
    r.age += dt;
    if (r.age > 3.6) {
      r.age = 0;
      r.m.position.set(px + (Math.random() - 0.5) * 0.8, 0.08, pz + 0.7);
    }
    const s = 0.5 + r.age * 0.65;
    r.m.scale.setScalar(s);
    r.m.material.opacity = diving ? 0 : (1 - r.age / 3.6) * 0.07;
    r.m.position.y = 0.15 + Math.sin(elapsed + i) * 0.04;
  }
  for (let i = 0; i < fish.length; i++) {
    const f = fish[i],
      z = pz - 70 + ((f.offset + elapsed * (1 + (i % 3))) % 180);
    f.g.position.set(f.lane + Math.sin(elapsed * 0.4 + f.s) * 6, -f.depth, z);
    f.g.rotation.y = Math.sin(elapsed * 0.3 + f.s) * 0.3;
    f.tail.rotation.z = Math.sin(elapsed * 7 + f.s) * 0.4;
  }
  for (let i = 0; i < porpoises.length; i++) {
    const f = porpoises[i];
    const a = elapsed * 0.55 + i * 2;
    f.g.position.set(
      (i - 1) * 20 + Math.sin(a) * 6,
      -1.3 + Math.sin(a) * 1.6,
      pz - 18 - i * 17,
    );
    f.g.rotation.x = Math.cos(a) * 0.27;
    f.tail.rotation.x = Math.sin(a * 4) * 0.22;
  }
  for (let i = 0; i < birds.length; i++) {
    const b = birds[i];
    b.g.position.set(
      Math.sin(elapsed * 0.04 + i) * 150,
      30 + (i % 4) * 8,
      pz - 130 - b.offset,
    );
    for (let j = 0; j < 2; j++)
      b.wings[j].rotation.z = Math.sin(elapsed * 3 + i) * (j ? -0.4 : 0.4);
  }
  for (let i = 0; i < rings.length; i++) {
    const r = rings[i];
    r.core.rotation.y = elapsed;
    r.core.position.y = Math.sin(elapsed * 2) * 0.3;
    r.group.visible = !r.got;
    if (
      !r.got &&
      started &&
      r.group.position.distanceTo(swimmer.position) < 5.5
    ) {
      r.got = true;
      collected++;
      energy = clamp(energy + 20, 0, 100);
      toast(
        [
          "生态发现 ① · 江豚：长江里的微笑天使",
          "生态发现 ② · 鱼群：水下的银色邻居",
          "生态发现 ③ · 江鸥：与江风同行",
        ][i],
      );
    }
    if (!r.got && pz < r.group.position.z - 20) {
      r.group.position.z = pz - 65;
    }
  }
  water.position.z = pz - 450;
  bed.position.z = pz - 450;
  waterUniforms.time.value = elapsed;
  bedShader.uniforms.time.value = elapsed;
  waterUniforms.player.value.set(px, pz);
  waterUniforms.night.value = night;
  waterUniforms.under.value = diving ? 1 : 0;
  if (started) {
    if (diving) {
      desired.set(px + 1.1, -1.5, pz + 5.8);
      look.set(px, -2.3, pz - 4.5);
    } else if (view === 0) {
      desired.set(px + (innerWidth < innerHeight ? 0.8 : 1.3), 2.8, pz + 5.7);
      look.set(px, -0.05, pz - 3.4);
    } else if (view === 1) {
      desired.set(px, 0.7, pz - 0.1);
      look.set(px, 0.9, pz - 35);
    } else {
      desired.set(px + 12, 28, pz + 18);
      look.set(px, 0, pz - 12);
    }
    camera.position.lerp(desired, 1 - Math.exp(-dt * 2));
    camera.lookAt(look);
  } else {
    camera.position.set(24 + Math.sin(elapsed * 0.06) * 3, 8.5, pz + 24);
    camera.lookAt(-30, 4, pz - 150);
  }
  swimmer.visible = !(started && view === 1 && !diving);
  waterUniforms.eye.value.copy(camera.position);
  if (filter)
    filter.frequency.setTargetAtTime(
      diving ? 280 : 650,
      audioCtx.currentTime,
      0.2,
    );
  hudTime += dt;
  if (hudTime > 0.12) {
    hudTime = 0;
    $("distance").textContent = Math.floor(distance);
    $("speed").textContent = speed.toFixed(1);
    $("energy").style.width = energy + "%";
    $("progress").style.width = distance / 8 + "%";
    $("encounters").textContent = `生态发现 ${collected} / 3`;
    $("weather").textContent =
      night > 0.5 ? "20:10 · 江上月明" : "17:40 · 江上晴";
  }
  renderer.render(scene, camera);
  window.__riverState = {
    started,
    paused,
    city,
    distance,
    energy,
    speed,
    diving,
    stroke,
    collected,
    renderer: "WebGL2",
    drawCalls: renderer.info.render.calls,
  };
}
requestAnimationFrame(frame);
