const downloadURI = (uri, name) => {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const saveStage = (stage, name, quality = 0.8) => {
  if (!stage?.toDataURL) return;

  const dataURL = stage.toDataURL({
    quality,
    mimeType: 'image/jpeg',
    imageSmoothingEnabled: true,
  });

  downloadURI(dataURL, `${name}.jpg`);
};
