/**
 * Supabase Storage paths for course MP4s (private bucket + signed URLs).
 *
 * Env:
 *   NEXT_PUBLIC_COURSE_VIDEO_BUCKET — bucket id (required for in-app playback)
 *   NEXT_PUBLIC_COURSE_VIDEO_OBJECT_PREFIX — optional folder, e.g. "videos" (no leading slash)
 *   NEXT_PUBLIC_COURSE_VIDEO_PATH_TEMPLATE — default "{nn}.mp4" → 01.mp4 … 30.mp4
 *     Placeholders: {n} unpadded, {nn} two digits, {nnn} three digits
 */

const BUCKET = process.env.NEXT_PUBLIC_COURSE_VIDEO_BUCKET?.trim() ?? "";

export function courseVideoStorageConfigured(): boolean {
  return BUCKET.length > 0;
}

export function getCourseVideoBucket(): string {
  return BUCKET;
}

export function lessonStorageObjectPath(lessonNumber: number): string {
  const template =
    process.env.NEXT_PUBLIC_COURSE_VIDEO_PATH_TEMPLATE?.trim() ?? "{nn}.mp4";
  const prefix =
    process.env.NEXT_PUBLIC_COURSE_VIDEO_OBJECT_PREFIX?.trim() ?? "";
  const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, "");

  const n = lessonNumber;
  const nn = String(n).padStart(2, "0");
  const nnn = String(n).padStart(3, "0");
  const fileName = template
    .replace(/\{nnn\}/g, nnn)
    .replace(/\{nn\}/g, nn)
    .replace(/\{n\}/g, String(n));

  if (normalizedPrefix) {
    return `${normalizedPrefix}/${fileName}`;
  }
  return fileName;
}
