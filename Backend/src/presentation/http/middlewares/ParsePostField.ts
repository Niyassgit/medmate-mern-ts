import { Request, Response, NextFunction } from "express";
import { ParsePostBody } from "../../types/ParsePostBody";

export const parsePostField = (
  req: Request<unknown, unknown, ParsePostBody>,
  res: Response,
  next: NextFunction
) => {
  const parseStringArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (typeof item === "string") {
            if (item.startsWith("[") || item.startsWith("{")) {
              try {
                const parsed: unknown = JSON.parse(item);
                if (Array.isArray(parsed)) {
                  return parsed.filter(
                    (p): p is string => typeof p === "string"
                  );
                }
                return item;
              } catch {
                return item;
              }
            }
            return item;
          }
          return item;
        })
        .flat(Infinity)
        .filter(
          (item): item is string =>
            typeof item === "string" && Boolean(item) && item.trim() !== ""
        );
    }

    if (typeof value === "string") {
      try {
        const parsed: unknown = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parseStringArray(parsed as string | string[]);
        }
      } catch {
        return [value].filter(Boolean);
      }
    }

    return [];
  };

  const extractS3key = (url: string): string => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return '';
    }
    
    // If it's already a key (doesn't start with http), return as is
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return url;
    }
    
    try {
      // If it's a URL, extract the pathname (S3 key)
      // AWS S3 signed URLs format: https://bucket.s3.region.amazonaws.com/key?query
      const u = new URL(url);
      let key = u.pathname;
      
      // Remove leading slash from pathname to get the S3 key
      if (key.startsWith('/')) {
        key = key.substring(1);
      }
      
      // Remove trailing slash if present
      if (key.endsWith('/')) {
        key = key.slice(0, -1);
      }
      
      if (!key || key.trim() === '') {
        // Try fallback extraction
        const match = url.match(/\/(products|images)\/[^?]+/);
        if (match) {
          return match[0].substring(1);
        }
        return '';
      }
      
      return key;
    } catch (error) {
      // If URL parsing fails, try to extract key manually
      // Look for patterns like /products/... or /images/...
      const match = url.match(/\/(products|images)\/[^?]+/);
      if (match) {
        return match[0].substring(1);
      }
      return '';
    }
  };

  req.body.ingredients = parseStringArray(req.body.ingredients);
  req.body.useCases = parseStringArray(req.body.useCases);
  const parsedExistingImages = parseStringArray(req.body.existingImages);
  const extractedKeys = parsedExistingImages.map(extractS3key).filter(Boolean);
  (req.body as any).existingImages = extractedKeys;
  req.body.territories = parseStringArray(req.body.territories);
  req.body.territoryIds = parseStringArray(req.body.territoryIds);
  next();
};
