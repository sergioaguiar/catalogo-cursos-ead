// client/src/types.ts
export type CourseStatus = "ativo" | "inativo";

export type Course = {
  id: number;
  title: string;
  status: CourseStatus;
  created_at: string;
};

export type Offer = {
  id: number;
  course_id: number;
  created_at: string;
  period_start: string;
  period_end: string;
};

export type OfferFull = Offer & {
  course: Course;
};
