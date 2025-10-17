import { UploadedFile } from "../../types/productPostBody";

function isUploadedFile(file: unknown): file is UploadedFile {
  return (
    typeof file === "object" &&
    file !== null &&
    "key" in file &&
    typeof (file as Record<string, unknown>).key === "string"
  );
}

export const processImages = (
  existingImages: unknown,
  files: unknown
): string[] => {
  let existing: string[] = [];
  
  if (existingImages) {
    if (Array.isArray(existingImages)) {
      existing = existingImages.filter(
        (img): img is string => typeof img === "string" && img.trim() !== ""
      );
    } else if (typeof existingImages === "string" && existingImages.trim() !== "") {
      existing = [existingImages];
    }
  }

  let newImages: string[] = [];
  
  if (files && Array.isArray(files)) {
    newImages = files
      .filter(isUploadedFile) 
      .map((file) => file.key) 
       .filter((key): key is string => typeof key === "string" && key.trim() !== "");
  }

  return [...existing, ...newImages];
};