import { getMetadata } from "@/app/db/functions"

export async function GET(
    request: Request,
) {
    const metadata = getMetadata()
    return Response.json(metadata)
}
