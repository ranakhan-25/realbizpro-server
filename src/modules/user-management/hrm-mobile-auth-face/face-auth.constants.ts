export const FACE_AUTH_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const;

export const FACE_AUTH_MAX_FILE_SIZE =
  10 * 1024 * 1024;
export const FACE_AUTH_MIN_IMAGES = 1;
export const FACE_AUTH_MAX_IMAGES = 10;
export const FACE_AUTH_AI_TIMEOUT_MS = 30_000;
export const FACE_AUTH_UPLOAD_TIMEOUT_MS = 30_000;
export const FACE_AUTH_EXTERNAL_TIMEOUT_MS = 30_000;
export const FACE_AUTH_ENABLE_UPLOAD_API = false;
export const FACE_AUTH_UPLOAD_ENDPOINT =
  '/pos/api/v1/files/upload';
export const FACE_AUTH_EXTERNAL_ENROLL_ENDPOINT =
  '/auth/enroll';
export const FACE_AUTH_EXTERNAL_AUTHENTICATE_ENDPOINT =
  '/api/authenticate';
