// Step 2: paint soft glowing light patches on the wall.
var canvas = document.getElementById('scene');
var ctx = canvas.getContext('2d');

function draw() {
  var dpr = window.devicePixelRatio || 1;
  var w = window.innerWidth, h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  drawWall(w, h);
  var s = Math.min(w, h) / 400;
  drawPatches(w, h, s);
  drawLantern(w / 2, h * 0.5, s);
}

// A dark wall with a soft vignette and faint brick lines
function drawWall(w, h) {
  var g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.7);
  g.addColorStop(0, '#2a2530');
  g.addColorStop(1, '#0a080d');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  var bh = 40, bw = 90, row = 0;
  for (var y = 0; y < h; y += bh, row++) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
    ctx.stroke();
    for (var x = (row % 2) * bw / 2; x < w; x += bw) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, y);
      ctx.lineTo(x + 0.5, y + bh);
      ctx.stroke();
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

// Light patches spread over the wall, brightest near the lantern.
// 'lighter' blending makes overlapping patches add up and glow.
function drawPatches(w, h, s) {
  var cx = w / 2, cy = h * 0.5;
  var u = Math.min(w, h);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // big warm wash around the lantern
  blob(cx, cy, u * 0.9, '255,170,80', 0.35);

  // patches: [dx, dy, radius, colour, strength] relative to lantern, in units of u
  var P = [
    [-0.55, -0.30, 0.28, '255,190,90', 0.30],
    [0.50, -0.35, 0.24, '255,140,110', 0.28],
    [-0.45, 0.30, 0.22, '255,210,120', 0.26],
    [0.55, 0.28, 0.30, '255,160,70', 0.28],
    [0.05, -0.48, 0.20, '255,220,150', 0.22],
    [0.02, 0.50, 0.24, '240,150,90', 0.22],
    [-0.85, 0.02, 0.22, '230,140,100', 0.18],
    [0.88, -0.02, 0.22, '255,200,110', 0.18]
  ];
  P.forEach(function (p) {
    blob(cx + p[0] * u, cy + p[1] * u, p[2] * u, p[3], p[4]);
  });
  ctx.restore();
}

// The lantern, drawn around (cx, cy) with scale s
function drawLantern(cx, cy, s) {
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

  ctx.strokeStyle = rim;
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

  ctx.fillStyle = '#fff6c8';
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.quadraticCurveTo(14, 8, 0, 30);
  ctx.quadraticCurveTo(-14, 8, 0, -22);
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

window.addEventListener('resize', draw);
draw();
