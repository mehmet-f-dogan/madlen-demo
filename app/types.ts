import { CognitiveLevel, DifficultyLevel, Question } from "@prisma/client";

export type Metadata = {
    total_questions: number;
    coverage_pages: number[];
    primary_topics: string[];
};

export type QuestionSet = {
    questions: Question[];
    metadata: Metadata;
};

export type GetAllQuestionsFilter = {
    difficulty_level?: DifficultyLevel,
    cognitive_level?: CognitiveLevel,
    course_name?: string,
    context_pages?: number[],
    question_text?: string
}

export type UpdateQuestion = Partial<Question>