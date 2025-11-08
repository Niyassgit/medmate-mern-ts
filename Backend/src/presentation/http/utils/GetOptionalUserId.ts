import { JwtPayload } from "../../types/auth";

const isJwtPayload = (value: unknown): value is JwtPayload => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.userId === "string" &&
    typeof candidate.role === "string"
  );
};

export const GetOptionalUserId = (value: unknown): string | undefined => {
  return isJwtPayload(value) ? value.userId : undefined;
};