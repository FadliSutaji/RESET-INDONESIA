const text_reset = document.getElementById('text_reset');
const text_indonesia = document.getElementById('text_indonesia');
const theme_context = document.getElementById('theme_context');
const fileInput = document.getElementById('file');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

// Tema
const THEMES = [
  // Duotone merah dan putih
  {
    shadow: { r: 178, g: 34,  b: 34  }, // Firebrick
    highlight: { r: 255, g: 248, b: 240 }, // Almost white
    text_reset_color: '#B22222',
    text_indonesia_color: '#FFF8F0',
    color_context: 'Merah untuk keberanian, Putih untuk kesucian.'
  },
  // Duotone merah muda dan hijau
  {
    shadow: { r: 34, g: 139, b: 34 }, // HotPink
    highlight: { r: 255, g: 105, b: 180 }, // ForestGreen
    text_reset_color: '#FF69B4',
    text_indonesia_color: '#228B22',
    color_context: 'Pink untuk harapan baru, hijau untuk kepedulian bersama.'
  },
]

// Index Tema yang digunakan
let themeIndex = 0;

function applyThemeOnImageFile(file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    process(img);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

// Mengatur index tema
function setThemeIndex(index) {
  themeIndex = index;
  text_reset.style.color = THEMES[index].text_reset_color;
  text_indonesia.style.color = THEMES[index].text_indonesia_color;
  theme_context.innerHTML = THEMES[index].color_context;
  applyThemeOnImageFile(fileInput.files[0]);
}

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

    const SHADOW = THEMES[themeIndex].shadow;
    const HIGHLIGHT = THEMES[themeIndex].highlight;

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
  applyThemeOnImageFile(file);
});

downloadBtn.addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'resetindonesia.png';
  a.click();
});

setThemeIndex(0)