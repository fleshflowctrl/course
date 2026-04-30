/** Curriculum metadata — mirrors the course on your hosting platform. */

export type CourseModule = {
  id: string;
  title: string;
  videoCount: number;
  videos: readonly string[];
};

export const COURSE_MODULES: readonly CourseModule[] = [
  {
    id: "foundations",
    title: "Module 1: Foundations",
    videoCount: 5,
    videos: [
      "What is perimenopause, menopause, and postmenopause",
      "The hormonal shifts explained simply",
      "Why most doctors don't help (and how to find one who does)",
      "The 60+ symptoms — the full list",
      "How to track what's happening",
    ],
  },
  {
    id: "symptoms",
    title: "Module 2: Major Symptoms",
    videoCount: 10,
    videos: [
      "Hot flushes — what's happening, what helps",
      "Sleep & 3am wake-ups",
      "Brain fog & cognitive changes",
      "Mood swings & anxiety",
      "Rage & emotional regulation",
      "Joint pain & body changes",
      "Weight & body composition",
      "Libido & sexual changes",
      "Periods becoming chaotic",
      "Skin, hair & physical changes",
    ],
  },
  {
    id: "treatment",
    title: "Module 3: Treatment Options",
    videoCount: 8,
    videos: [
      "HRT explained — what it is, what it isn't",
      "The HRT decision: who it's right for, who it isn't",
      "Non-hormonal medical options",
      "Supplements with evidence (and supplements that are scams)",
      "Diet & nutrition that actually moves the needle",
      "Exercise — what changes after 40",
      "Sleep protocols",
      "Stress & nervous system regulation",
    ],
  },
  {
    id: "practical",
    title: "Module 4: Practical Life",
    videoCount: 7,
    videos: [
      "Talking to your doctor (with scripts)",
      "Talking to your partner",
      "Navigating perimenopause at work",
      "Building your support system",
      "Tracking & data — what to log and why",
      "When to get help: red flags vs. normal",
      "The 5-year plan: what to expect",
    ],
  },
] as const;

export const FIRST_LESSON_LABEL =
  "Module 1 — What is perimenopause, menopause, and postmenopause";
