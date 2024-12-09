import { deleteQuestion, getQuestion, updateQuestion } from "@/app/db/functions"
import { UpdateQuestion } from "@/app/types"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id
    const question = getQuestion(id)

    if (!question) {
        return new Response("Question not found.", {
            status: 404,
        })
    } else {
        return Response.json(question)
    }

}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id
    const updateData : UpdateQuestion = await request.json()
    const result = updateQuestion(id, updateData)
    if (!result) {
        return new Response(null, {
            status: 400,
        }
        )
    } else {
        return Response.json(result)
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id
    const question = deleteQuestion(id)
    if (!question) {
        return new Response("Question not found.", {
            status: 404,
        }
        )
    } else {
        return new Response("Question deleted.", {
            status: 200,
        }
        )
    }
}