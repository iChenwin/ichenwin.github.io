import * as T from "./vendor/three.module.js";
// Analytic two-bone IK. Segment lengths stay constant throughout each stroke.
const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
const up = V(0, 1, 0),
  tau = Math.PI * 2;
const skin = new T.MeshStandardMaterial({ color: 0xd7a17c, roughness: 0.52 });
const suit = new T.MeshStandardMaterial({ color: 0x205d66, roughness: 0.38 });
const cap = new T.MeshStandardMaterial({ color: 0xe7b857, roughness: 0.32 });
const goggles = new T.MeshStandardMaterial({
  color: 0x163a45,
  metalness: 0.35,
  roughness: 0.16,
});
const unitSphere = new T.SphereGeometry(1, 24, 16);
function oval(parent, m, pos, size) {
  const o = new T.Mesh(unitSphere, m);
  o.position.copy(pos);
  o.scale.set(...size);
  parent.add(o);
  return o;
}
function limb(parent, a, b, r1, r2, m) {
  const o = new T.Mesh(new T.CylinderGeometry(r2, r1, 1, 12, 1), m);
  parent.add(o);
  return {
    mesh: o,
    set(p, q) {
      const d = q.clone().sub(p);
      o.position.copy(p).add(q).multiplyScalar(0.5);
      o.scale.y = d.length();
      o.quaternion.setFromUnitVectors(up, d.normalize());
    },
  };
}
export function solveJoint(a, end, l1, l2, pole) {
  const d = end.clone().sub(a),
    len = T.MathUtils.clamp(d.length(), 0.025, l1 + l2 - 0.001);
  d.normalize();
  const b = a.clone().addScaledVector(d, len);
  const x = (l1 * l1 - l2 * l2 + len * len) / (2 * len),
    h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  const n = pole.clone().sub(a);
  n.addScaledVector(d, -n.dot(d));
  if (n.lengthSq() < 1e-5) n.set(0, 1, 0);
  n.normalize();
  return {
    joint: a.clone().addScaledVector(d, x).addScaledVector(n, h),
    end: b,
  };
}
function curve(frames, t) {
  t = ((t % 1) + 1) % 1;
  let k = 0;
  while (k < frames.length - 2 && t >= frames[k + 1][0]) k++;
  const a = frames[k],
    b = frames[k + 1];
  let f = (t - a[0]) / (b[0] - a[0]);
  f = f * f * (3 - 2 * f);
  return V(
    T.MathUtils.lerp(a[1], b[1], f),
    T.MathUtils.lerp(a[2], b[2], f),
    T.MathUtils.lerp(a[3], b[3], f),
  );
}
const crawl = [
  [0, 0.38, 0.04, -1.12],
  [0.12, 0.43, -0.2, -1.08],
  [0.34, 0.56, -0.46, -0.5],
  [0.53, 0.4, -0.22, 0.26],
  [0.63, 0.49, 0.12, 0.37],
  [0.78, 0.67, 0.47, -0.35],
  [0.91, 0.42, 0.26, -0.97],
  [1, 0.38, 0.04, -1.12],
];
const breast = [
  [0, 0.24, -0.05, -1.1],
  [0.18, 0.65, -0.12, -0.96],
  [0.37, 0.72, -0.3, -0.52],
  [0.51, 0.27, -0.34, -0.54],
  [0.68, 0.18, -0.08, -0.91],
  [0.82, 0.24, -0.05, -1.1],
  [1, 0.24, -0.05, -1.1],
];
const back = [
  [0, 0.38, 0.02, -1.12],
  [0.18, 0.66, 0.25, -0.81],
  [0.38, 0.67, 0.35, -0.22],
  [0.54, 0.45, 0.07, 0.28],
  [0.67, 0.45, -0.3, 0.24],
  [0.81, 0.48, -0.7, -0.45],
  [1, 0.38, 0.02, -1.12],
];
export function createSwimmer() {
  const root = new T.Group(),
    body = new T.Group();
  root.add(body);
  // Continuous torso profile rather than a stack of disconnected primitives.
  const profile = [
    [0.14, -0.66],
    [0.27, -0.53],
    [0.37, -0.39],
    [0.35, -0.17],
    [0.29, 0.12],
    [0.25, 0.38],
    [0.27, 0.55],
    [0.21, 0.66],
  ].map(([r, z]) => new T.Vector2(r, z));
  const torso = new T.Mesh(new T.LatheGeometry(profile, 32), suit);
  torso.rotation.x = Math.PI / 2;
  torso.scale.z = 0.59;
  body.add(torso);
  oval(body, skin, V(0, 0.025, -0.68), [0.125, 0.13, 0.22]);
  const head = new T.Group();
  head.position.set(0, 0.055, -0.85);
  body.add(head);
  oval(head, skin, V(0, 0, -0.04), [0.185, 0.205, 0.245]);
  oval(head, cap, V(0, 0.085, 0.005), [0.19, 0.16, 0.245]);
  oval(head, skin, V(0, -0.045, -0.255), [0.043, 0.055, 0.045]);
  for (const s of [-1, 1]) {
    oval(head, skin, V(s * 0.184, -0.01, 0.01), [0.032, 0.064, 0.041]);
    oval(head, goggles, V(s * 0.088, -0.035, -0.244), [0.076, 0.048, 0.028]);
  }
  const strap = new T.Mesh(new T.TorusGeometry(0.185, 0.011, 5, 40), goggles);
  strap.rotation.x = Math.PI / 2;
  strap.scale.z = 1.18;
  head.add(strap);
  const limbs = [],
    hands = [];
  for (const side of [-1, 1])
    for (const leg of [false, true]) {
      const base = V(side * (leg ? 0.195 : 0.33), -0.02, leg ? 0.53 : -0.4),
        r = leg ? 0.12 : 0.087;
      const upper = limb(body, null, null, r, r * 0.82, leg ? suit : skin),
        lower = limb(body, null, null, r * 0.79, r * 0.46, skin);
      const joint = oval(body, skin, base, [r * 0.82, r * 0.82, r * 0.82]);
      const end = new T.Group();
      body.add(end);
      if (leg) {
        oval(end, skin, V(0, -0.01, 0.09), [0.075, 0.052, 0.18]);
        for (let i = 0; i < 5; i++)
          oval(
            end,
            skin,
            V((i - 2) * 0.025, -0.015, 0.235 - i * 0.009),
            [0.018, 0.023, 0.043],
          );
      } else {
        oval(end, skin, V(0, 0, 0.055), [0.073, 0.034, 0.105]);
        for (let i = 0; i < 4; i++) {
          const digit = new T.Group();
          digit.position.set((i - 1.5) * 0.032, 0, 0.13);
          end.add(digit);
          oval(digit, skin, V(0, -0.005, 0.035), [
            0.014,
            0.018,
            0.055 - i * 0.003,
          ]);
          oval(
            digit,
            skin,
            V(0, -0.019, 0.087 - i * 0.007),
            [0.012, 0.015, 0.033],
          );
        }
        oval(end, skin, V(side * 0.075, -0.01, 0.06), [0.025, 0.025, 0.065]);
        hands.push(end);
      }
      limbs.push({ side, leg, base, upper, lower, joint, end });
    }
  const lastY = [0, 0];
  let smoothRoll = 0;
  const sample = V();
  function update(phase, stroke, effort, steer, dt) {
    const cycle = phase / tau,
      roll =
        stroke === 0
          ? Math.sin(phase) * 0.27
          : stroke === 2
            ? Math.sin(phase) * 0.2
            : Math.sin(phase) * 0.025;
    smoothRoll = T.MathUtils.damp(smoothRoll, roll + steer * 0.09, 7, dt);
    body.rotation.set(
      Math.sin(phase * 2) * 0.018,
      Math.sin(phase) * 0.025,
      (stroke === 2 ? Math.PI : 0) + smoothRoll,
    );
    body.position.y = Math.sin(phase * 2) * 0.025;
    head.rotation.z =
      stroke === 0 ? Math.pow(Math.max(0, Math.sin(phase)), 4) * 0.72 : 0;
    head.rotation.x =
      stroke === 1 ? -0.12 - Math.max(0, Math.sin(phase)) * 0.17 : 0;
    for (const l of limbs) {
      const { side, leg, base } = l;
      let target, pole;
      if (!leg) {
        const c = cycle + (stroke === 1 ? 0 : side === 1 ? 0.5 : 0);
        target = curve(stroke === 0 ? crawl : stroke === 1 ? breast : back, c);
        target.x *= side;
        const recovery = ((c % 1) + 1) % 1 > 0.6;
        pole = V(side * 0.85, recovery && stroke === 0 ? 0.62 : -0.16, -0.47);
      } else if (stroke === 1) {
        const a = (((cycle + 0.13) % 1) + 1) % 1;
        target = curve(
          [
            [0, 0.19, -0.02, 1.43],
            [0.25, 0.22, -0.02, 1.43],
            [0.48, 0.49, -0.28, 1.01],
            [0.63, 0.6, -0.13, 1.22],
            [0.82, 0.23, -0.02, 1.43],
            [1, 0.19, -0.02, 1.43],
          ],
          a,
        );
        target.x *= side;
        pole = V(side * 0.5, -0.44, 0.8);
      } else {
        const kick = phase * 3 + (side === 1 ? Math.PI : 0);
        target = V(
          side * 0.19,
          -0.04 + Math.sin(kick) * 0.15,
          1.43 - Math.max(0, Math.cos(kick)) * 0.04,
        );
        pole = V(side * 0.22, -0.4, 0.96);
      }
      const solved = solveJoint(
        base,
        target,
        leg ? 0.47 : 0.39,
        leg ? 0.46 : 0.39,
        pole,
      );
      l.upper.set(base, solved.joint);
      l.lower.set(solved.joint, solved.end);
      l.joint.position.copy(solved.joint);
      l.end.position.copy(solved.end);
      const direction = solved.end.clone().sub(solved.joint).normalize();
      l.end.quaternion.setFromUnitVectors(V(0, 0, 1), direction);
      if (leg) l.end.rotateX(0.25 + Math.sin(phase * 3) * 0.06);
      else l.end.rotateZ(side * 0.12);
    }
    root.updateMatrixWorld(true);
    const entries = [];
    hands.forEach((h, i) => {
      h.getWorldPosition(sample);
      if (lastY[i] > 0.02 && sample.y < 0.02 && effort > 0.2)
        entries.push(sample.clone());
      lastY[i] = sample.y;
    });
    return entries;
  }
  return { root, update };
}
