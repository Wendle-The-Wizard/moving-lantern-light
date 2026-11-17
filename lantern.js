// Step 1: draw the dark wall and the lantern. Light comes later!
var canvas = document.getElementById('scene');
var ctx = canvas.getContext('2d');

function draw() {
  var dpr = window.devicePixelRatio || 1;
  var w = window.innerWidth, h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  drawWall(w, h);
  // lantern size depends on the smaller side so it fits on a phone
  var s = Math.min(w, h) / 400;
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

// The lantern, drawn around (cx, cy) with scale s
function drawLantern(cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);

  var metal = '#1b171c', rim = '#4a4048';

  // hanging chain from the top of the screen
  ctx.strokeStyle = rim;
  ctx.lineWidth = 3;
  for (var i = -cy / s; i < -112; i += 12) {
    ctx.beginPath();
    ctx.ellipse(0, i + 6, 3.5, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // top ring and roof
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

  // glass body: warm gradient
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

  // the flame and its little glow
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

  // candle under the flame
  ctx.fillStyle = '#efe6d2';
  ctx.fillRect(-7, 30, 14, 40);

  // metal frame bars over the glass
  ctx.strokeStyle = metal;
  ctx.lineWidth = 5;
  [-52, -17, 17, 52].forEach(function (x) {
    ctx.beginPath();
    ctx.moveTo(x, -62);
    ctx.lineTo(x * 0.85, 70);
    ctx.stroke();
  });

  // base
  ctx.fillStyle = metal;
  ctx.strokeStyle = rim;
  ctx.lineWidth = 2;
  ctx.fillRect(-52, 70, 104, 14);
  ctx.strokeRect(-52, 70, 104, 14);

  ctx.restore();
}

window.addEventListener('resize', draw);
draw();
