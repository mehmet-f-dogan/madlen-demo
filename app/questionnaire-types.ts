type QCognitiveLevel =
  | "knowledge"
  | "comprehension"
  | "application"
  | "analysis"
  | "synthesis"
  | "evaluation";

type QDifficultyLevel = "basic" | "intermediate" | "advanced";

interface QSupportingEvidence {
  point: string;
  page_reference: number;
}

interface QModelAnswer {
  main_argument: string;
  key_points: string[];
  supporting_evidence: QSupportingEvidence[];
  conclusion: string;
}

interface QQuestion {
  id: string;
  question_text: string;
  context_pages: number[];
  difficulty_level: QDifficultyLevel;
  cognitive_level: QCognitiveLevel;
  key_concepts: string[];
  course_name: string;
  model_answer: QModelAnswer;
  grading_criteria: string[];
}

interface QMetadata {
  total_questions: number;
  coverage_pages: number[];
  primary_topics: string[];
}

interface Questionnaire {
  questions: QQuestion[];
  metadata: QMetadata;
}
