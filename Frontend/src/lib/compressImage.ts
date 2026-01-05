import imageCompression from "browser-image-compression";

export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
};
