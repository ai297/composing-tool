export const getFit = (imageSize, sceneWidth, sceneHeight, border = 0) => {
  const { width, height } = imageSize;
  const scale = Math.min(sceneWidth / width, sceneHeight / height, 1) * (1 - border);

  return {
    get size() { return { width: Math.round(width * scale), height: Math.round(height * scale) }; },
    position: { x: Math.round((sceneWidth - width * scale) / 2), y: Math.round((sceneHeight - height * scale) / 2), },
    scale: { x: scale, y: scale, },
  };
};

export const getFill = (imageSize, sceneWidth, sceneHeight, enlarge = false) => {
  const { width, height } = imageSize;
  let scale = Math.max(sceneWidth / width, sceneHeight / height);
  scale = scale > 1 && !enlarge ? 1 : scale;

  return {
    get size() { return { width: Math.round(width * scale), height: Math.round(height * scale) }; },
    position: { x: Math.round((sceneWidth - width * scale) / 2), y: Math.round((sceneHeight - height * scale) / 2), },
    scale: { x: scale, y: scale, },
  };
};

const isNotBlackOrWhite = (c) => c.color != 'rgb(255,255,255)' && c.color != 'rgb(0,0,0)';
const quantize = (c, qs) => Math.min(255, Math.round(c / qs) * qs);

export const getContentRelatedColors = (target, topN = 4, quantSize = 24, maxSize = 256) => {
  const konvaCanvas = target.toCanvas();
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');

  const originalWidth = konvaCanvas.width;
  const originalHeight = konvaCanvas.height;
  const scale = Math.min(1, maxSize / Math.max(originalWidth, originalHeight));
  const width = Math.floor(originalWidth * scale);
  const height = Math.floor(originalHeight * scale);

  tempCanvas.width = width;
  tempCanvas.height = height;

  ctx.drawImage(konvaCanvas, 0, 0, originalWidth, originalHeight, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height).data;
  const colorMap = new Map();
  const allColors = [];

  for (let i = 0; i < imageData.length; i += 4) {
    const rgb = { r: imageData[i], g: imageData[i + 1], b: imageData[i + 2] };
    const alpha = imageData[i + 3];

    if (alpha === 0) continue;

    const key = `rgb(${quantize(rgb.r, quantSize)},${quantize(rgb.g, quantSize)},${quantize(rgb.b, quantSize)})`;
    const expressiveness = Math.sqrt((rgb.r - rgb.g)**2 + (rgb.g - rgb.b)**2 + (rgb.b - rgb.r)**2); // "Выразительность" — отклонение от серого

    if (!colorMap.has(key)) {
      colorMap.set(key, { count: 0, expressiveness });
    }

    colorMap.get(key).count += 1;
    allColors.push(rgb);
  }

  const mediumColor = allColors.reduce((p, c) => { p.r += c.r; p.g += c.g; p.b += c.b; return p; },
    { r: 0, g: 0, b: 0, get color() { return `rgb(${this.r},${this.g},${this.b})` } });

  mediumColor.r = Math.round(mediumColor.r / allColors.length);
  mediumColor.g = Math.round(mediumColor.g / allColors.length);
  mediumColor.b = Math.round(mediumColor.b / allColors.length);

  const colors = [...colorMap.entries()].map(([color, { count, expressiveness }]) => {
    return { color, count, weight: count * (1 + expressiveness / 100)};
  });

  const resultColors = colors
    .filter(isNotBlackOrWhite)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, topN)
    .map(x => x.color);

  if (isNotBlackOrWhite(mediumColor) && !resultColors.includes(mediumColor.color))
    resultColors.unshift(mediumColor.color);

  return resultColors;
};
