export const getAssetsPath = (filename?: string) => {
  const basePath = `${import.meta.env.BASE_URL}assets/`;

  return filename ? `${basePath}${filename}` : basePath;
};
