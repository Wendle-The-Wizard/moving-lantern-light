// Step 3: the light patches drift and sway slowly.
var canvas = document.getElementById('scene');
var ctx = canvas.getContext('2d');
var W = 0, H = 0, DPR = 1;

// The wall never changes, so I paint it once into its own canvas and reuse it
var wallCanvas = document.createElement('canvas');

function resize() {
  DPR = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  wallCanvas.width = canvas.width;
  wallCanvas.height = canvas.height;
  var wctx = wallCanvas.getContext('2d');
  wctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  drawWall(wctx, W, H);
}

function drawWall(c, w, h) {
  var g = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.7);
  g.addColorStop(0, '#2a2530');
  g.addColorStop(1, '#0a080d');
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = 'rgba(255,255,255,0.04)';
  c.lineWidth = 1;
  var bh = 40, bw = 90, row = 0;
  for (var y = 0; y < h; y += bh, row++) {
    c.beginPath();
    c.moveTo(0, y + 0.5);
    c.lineTo(w, y + 0.5);
    c.stroke();
    for (var x = (row % 2) * bw / 2; x < w; x += bw) {
      c.beginPath();
      c.moveTo(x + 0.5, y);
      c.lineTo(x + 0.5, y + bh);
      c.stroke();
    }
  }
}

// One soft blob of light: a radial gradient that fades to nothing
function blob(x, y, r, rgb, a) {
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
  g.addColorStop(0.5, 'rgba(' + rgb + ',' + (a * 0.4) + ')');
  g.addColorStop(1, 'rgba(' + rgb + ',0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// patches: [dx, dy, radius, colour, strength] in units of u, plus
// sway: [speedX, speedY, phase, amount] so each one moves on its own rhythm
var P = [
  [-0.55, -0.30, 0.28, '255,190,90', 0.30, 0.11, 0.07, 0.0, 0.06],
  [0.50, -0.35, 0.24, '255,140,110', 0.28, 0.08, 0.13, 1.7, 0.07],
  [-0.45, 0.30, 0.22, '255,210,120', 0.26, 0.14, 0.09, 3.1, 0.06],
  [0.55, 0.28, 0.30, '255,160,70', 0.28, 0.06, 0.1, 4.4, 0.08],
  [0.05, -0.48, 0.20, '255,220,150', 0.22, 0.12, 0.05, 2.2, 0.05],
  [0.02, 0.50, 0.24, '240,150,90', 0.22, 0.09, 0.12, 5.3, 0.06],
  [-0.85, 0.02, 0.22, '230,140,100', 0.18, 0.07, 0.11, 0.9, 0.07],
  [0.88, -0.02, 0.22, '255,200,110', 0.18, 0.1, 0.08, 3.8, 0.07]
];

function drawPatches(t) {
  var cx = W / 2, cy = H * 0.5;
  var u = Math.min(W, H);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  // the big wash breathes very gently
  blob(cx, cy, u * (0.9 + 0.02 * Math.sin(t * 0.5)), '255,170,80', 0.35);
  P.forEach(function (p) {
    // slow sine drift in x and y, a little size pulse and a soft fade
    var dx = p[0] + p[8] * Math.sin(t * p[5] + p[7]);
    var dy = p[1] + p[8] * Math.cos(t * p[6] + p[7] * 1.3);
    var r = p[2] * (1 + 0.08 * Math.sin(t * 0.3 + p[7]));
    var a = p[4] * (0.85 + 0.15 * Math.sin(t * 0.4 + p[7] * 2));
    blob(cx + dx * u, cy + dy * u, r * u, p[3], a);
  });
  ctx.restore();
}

function drawLantern(cx, cy, s, t) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  var metal = '#1b171c', rim = '#4a4048';

  ctx.strokeStyle = rim;
  ctx.lineWidth = 3;
  for (var i = -cy / s; i < -112; i += 12) {
    ctx.beginPath();
    ctx.ellipse(0, i + 6, 3.5, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -108, 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = metal;
  ctx.strokeStyle = rim;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-20, -98);
  ctx.lineTo(20, -98);
  ctx.lineTo(60, -62);
  ctx.lineTo(-60, -62);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  var glass = ctx.createLinearGradient(0, -62, 0, 70);
  glass.addColorStop(0, '#ffd27a');
  glass.addColorStop(0.5, '#ffb347');
  glass.addColorStop(1, '#c8742a');
  ctx.fillStyle = glass;
  ctx.beginPath();
  ctx.moveTo(-52, -62);
  ctx.lineTo(52, -62);
  ctx.lineTo(44, 70);
  ctx.lineTo(-44, 70);
  ctx.closePath();
  ctx.fill();

  var glow = ctx.createRadialGradient(0, 10, 2, 0, 10, 55);
  glow.addColorStop(0, 'rgba(255,255,220,0.9)');
  glow.addColorStop(1, 'rgba(255,200,100,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(-60, -50, 120, 120);

  // the flame wobbles a tiny bit, just for fun
  var sway = Math.sin(t * 2.1) * 2;
  ctx.fillStyle = '#fff6c8';
  ctx.beginPath();
  ctx.moveTo(sway, -22);
  ctx.quadraticCurveTo(14, 8, 0, 30);
  ctx.quadraticCurveTo(-14, 8, sway, -22);
  ctx.fill();

  ctx.fillStyle = '#efe6d2';
  ctx.fillRect(-7, 30, 14, 40);

  ctx.strokeStyle = metal;
  ctx.lineWidth = 5;
  [-52, -17, 17, 52].forEach(function (x) {
    ctx.beginPath();
    ctx.moveTo(x, -62);
    ctx.lineTo(x * 0.85, 70);
    ctx.stroke();
  });

  ctx.fillStyle = metal;
  ctx.strokeStyle = rim;
  ctx.lineWidth = 2;
  ctx.fillRect(-52, 70, 104, 14);
  ctx.strokeRect(-52, 70, 104, 14);
  ctx.restore();
}

function frame(ms) {
  var t = ms / 1000;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(wallCanvas, 0, 0);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  drawPatches(t);
  drawLantern(W / 2, H * 0.5, Math.min(W, H) / 400, t);
  requestAnimationFrame(frame);
}

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(frame);
