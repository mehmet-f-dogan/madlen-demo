import { createQuestions, getAllQuestions } from "@/app/db/functions";
import { GetAllQuestionsFilter } from "@/app/types";

export async function GET(
    request: Request,
) {
    let filters : GetAllQuestionsFilter | undefined = undefined
    try {
        filters = await request.json()
    } catch (error) {
        
    }
    return Response.json(await getAllQuestions(filters))
}

export async function POST(
    request: Request,
) {
    const questionSet : Questionnaire = await request.json()
    return await createQuestions(questionSet.questions)
}


