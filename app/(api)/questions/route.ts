import { createQuestions, getAllQuestions } from "@/app/db/functions";
import { GetAllQuestionsFilter, QuestionSet } from "@/app/types";

export async function GET(
    request: Request,
) {
    const filters : GetAllQuestionsFilter | undefined = await request.json()
    return Response.json(getAllQuestions(filters))
}

export async function POST(
    request: Request,
) {
    const questionSet : Questionnaire = await request.json()
    return createQuestions(questionSet.questions)
}


