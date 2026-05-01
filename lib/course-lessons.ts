import { COURSE_MODULES } from "@/content/course-data";

export type FlatLesson = {
  lessonNumber: number;
  moduleId: string;
  moduleTitle: string;
  title: string;
};

export const FLAT_LESSONS: FlatLesson[] = (() => {
  let num = 0;
  return COURSE_MODULES.flatMap((mod) =>
    mod.videos.map((title) => ({
      lessonNumber: ++num,
      moduleId: mod.id,
      moduleTitle: mod.title,
      title,
    })),
  );
})();

export const COURSE_LESSON_COUNT = FLAT_LESSONS.length;
