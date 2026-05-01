import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { COURSE_LESSON_COUNT } from "@/lib/course-lessons";
import {
  courseVideoStorageConfigured,
  getCourseVideoBucket,
  lessonStorageObjectPath,
} from "@/lib/course-storage";
import { createClient } from "@/utils/supabase/server";

const lessonSchema = z.coerce.number().int().min(1).max(COURSE_LESSON_COUNT);

export async function GET(request: Request) {
  if (!courseVideoStorageConfigured()) {
    return NextResponse.json(
      { error: "Course video storage is not configured" },
      { status: 503 },
    );
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = lessonSchema.safeParse(searchParams.get("lesson"));
  if (!parsed.success) {
    return NextResponse.json(
      { error: `Invalid lesson (use 1–${COURSE_LESSON_COUNT})` },
      { status: 400 },
    );
  }

  const lesson = parsed.data;
  const bucket = getCourseVideoBucket();
  const path = lessonStorageObjectPath(lesson);

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    console.error("[course/video-url]", path, error);
    return NextResponse.json(
      {
        error:
          "Could not create playback link. Check the file path and Storage policies.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ url: data.signedUrl });
}
