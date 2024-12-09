-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('basic', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "CognitiveLevel" AS ENUM ('knowledge', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation');

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "context_pages" INTEGER[],
    "difficulty_level" "DifficultyLevel" NOT NULL,
    "cognitive_level" "CognitiveLevel" NOT NULL,
    "key_concepts" TEXT[],
    "course_name" TEXT NOT NULL,
    "grading_criteria" TEXT[],

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelAnswer" (
    "id" TEXT NOT NULL,
    "main_argument" TEXT NOT NULL,
    "key_points" TEXT[],
    "conclusion" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,

    CONSTRAINT "ModelAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportingEvidence" (
    "id" TEXT NOT NULL,
    "point" TEXT NOT NULL,
    "page_reference" INTEGER NOT NULL,
    "model_answer_id" TEXT NOT NULL,

    CONSTRAINT "SupportingEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModelAnswer_question_id_key" ON "ModelAnswer"("question_id");

-- AddForeignKey
ALTER TABLE "ModelAnswer" ADD CONSTRAINT "ModelAnswer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportingEvidence" ADD CONSTRAINT "SupportingEvidence_model_answer_id_fkey" FOREIGN KEY ("model_answer_id") REFERENCES "ModelAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
