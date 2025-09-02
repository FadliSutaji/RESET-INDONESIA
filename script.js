const fileInput = document.getElementById('file');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

// TikTok-like duotone colors
const HIGHLIGHT = { r: 255, g: 105, b: 180 }; // softer pink
const SHADOW   = { r: 34, g: 139, b: 34 };   // darker green

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function process(img) {
  // canvas ikut ukuran asli gambar
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // ambil pixel untuk filter
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2];

    let lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    lum = lum * lum * (3 - 2 * lum);

    const dr = SHADOW.r + (HIGHLIGHT.r - SHADOW.r) * lum;
    const dg = SHADOW.g + (HIGHLIGHT.g - SHADOW.g) * lum;
    const db = SHADOW.b + (HIGHLIGHT.b - SHADOW.b) * lum;

    d[i]   = clamp(dr, 0, 255);
    d[i+1] = clamp(dg, 0, 255);
    d[i+2] = clamp(db, 0, 255);
  }

  ctx.putImageData(imageData, 0, 0);
  downloadBtn.disabled = false;
}



fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    process(img);
    URL.revokeObjectURL(url);
  };
  img.src = url;
});

downloadBtn.addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'duotone-tiktok.png';
  a.click();
});
