// Step 4: the light changes colour gently, and the motion is bigger so you can see it.
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
  c.strokeStyle = 'rgba(255,255,255,0.05)';
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

// Turn a hue (0-360) into an rgb string; I keep it soft and bright
function hsl(h, s, l) {
  return 'hsl(' + Math.round(h) + ',' + s + '%,' + l + '%)';
}

// One soft blob of light: a radial gradient that fades to nothing.
// hue is turned into rgba by using hsla strings.
function blob(x, y, r, hue, a) {
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'hsla(' + Math.round(hue) + ',90%,62%,' + a + ')');
  g.addColorStop(0.5, 'hsla(' + Math.round(hue) + ',90%,55%,' + (a * 0.4) + ')');
  g.addColorStop(1, 'hsla(' + Math.round(hue) + ',90%,50%,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// patches: [dx, dy, radius, baseHue, strength, speedX, speedY, phase, sway]
var P = [
  [-0.55, -0.30, 0.28, 38, 0.30, 0.35, 0.25, 0.0, 0.10],
  [0.50, -0.35, 0.24, 12, 0.28, 0.28, 0.40, 1.7, 0.11],
  [-0.45, 0.30, 0.22, 48, 0.26, 0.45, 0.30, 3.1, 0.10],
  [0.55, 0.28, 0.30, 28, 0.28, 0.22, 0.33, 4.4, 0.12],
  [0.05, -0.48, 0.20, 52, 0.22, 0.38, 0.20, 2.2, 0.09],
  [0.02, 0.50, 0.24, 20, 0.22, 0.30, 0.38, 5.3, 0.10],
  [-0.85, 0.02, 0.22, 8, 0.18, 0.25, 0.35, 0.9, 0.10],
  [0.88, -0.02, 0.22, 44, 0.18, 0.33, 0.27, 3.8, 0.10]
];

function drawPatches(t) {
  var cx = W / 2, cy = H * 0.5;
  var u = Math.min(W, H);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  // the big wash breathes and slowly wanders through warm hues
  blob(cx, cy, u * (0.9 + 0.04 * Math.sin(t * 0.7)), 32 + 14 * Math.sin(t * 0.15), 0.32);
  P.forEach(function (p, i) {
    var dx = p[0] + p[8] * Math.sin(t * p[5] + p[7]);
    var dy = p[1] + p[8] * Math.cos(t * p[6] + p[7] * 1.3);
    var r = p[2] * (1 + 0.1 * Math.sin(t * 0.5 + p[7]));
    var a = p[4] * (0.8 + 0.2 * Math.sin(t * 0.6 + p[7] * 2));
    // each patch drifts around its own hue: gold, rose, teal and violet tints come and go
    var hue = p[3] + 150 * Math.sin(t * 0.08 + p[7]) * (0.5 + 0.5 * Math.sin(t * 0.05 + i));
    blob(cx + dx * u, cy + dy * u, r * u, (hue + 360) % 360, a);
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

  // the glass is gently tinted by the same slow colour
  var gh = 38 + 25 * Math.sin(t * 0.15);
  var glass = ctx.createLinearGradient(0, -62, 0, 70);
  glass.addColorStop(0, hsl(gh + 5, 100, 74));
  glass.addColorStop(0.5, hsl(gh, 100, 63));
  glass.addColorStop(1, hsl(gh - 8, 70, 44));
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

  // the flame flickers
  var sway = Math.sin(t * 2.1) * 3 + Math.sin(t * 5.3) * 1.2;
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
  // the whole lantern swings a little on its chain
  var swing = Math.sin(t * 0.9) * 0.03;
  var s = Math.min(W, H) / 400;
  ctx.save();
  ctx.translate(W / 2, 0);
  ctx.rotate(swing);
  ctx.translate(-W / 2, 0);
  drawLantern(W / 2, H * 0.5, s, t);
  ctx.restore();
  requestAnimationFrame(frame);
}

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(frame);
