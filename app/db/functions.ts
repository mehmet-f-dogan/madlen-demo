"use server"

import { GetAllQuestionsFilter, Metadata, UpdateQuestion } from "../types";
import prisma from "./prisma";

export async function deleteQuestion(id: string) {
    const question = await getQuestion(id)

    if (!question) {
        return null
    }

    await prisma.supportingEvidence.deleteMany({
        where: {
            id: {
                in: question.model_answer?.supporting_evidence.map((evidence) => evidence.id)
            }
        }
    })

    await prisma.modelAnswer.delete({
        where: {
            id: question.model_answer?.id
        }
    })

    await prisma.question.delete({
        where: { id },
    });

    return question
}

export async function deleteAllQuestions() {
    await prisma.supportingEvidence.deleteMany({})
    await prisma.modelAnswer.deleteMany({})
    await prisma.question.deleteMany({})
}

export async function getQuestion(id: string) {
    const question = await prisma.question.findUnique({
        where: { id },
        include: {
            model_answer: {
                include: {
                    supporting_evidence: true
                }
            }
        }
    });

    return question
}

export async function createQuestions(questions: QQuestion[]) {
    const data = questions.map((question) => {
        const x = { ...question } as any
        x.model_answer = {
            create: question.model_answer
        }
        x.model_answer.create.supporting_evidence = {
            create: question.model_answer.supporting_evidence
        }
        return x
    })

    const promises = data.map((data) => {
        return prisma.question.create({
            data,
            include: {
                model_answer: {
                    include: {
                        supporting_evidence: true
                    }
                }
            }
        })
    })

    await Promise.all(promises)
}

export async function updateQuestion(id: string, updateData: UpdateQuestion) {
    if (updateData.id != undefined && id != updateData.id) {
        return null
    }
    const updatedQuestion = await prisma.question.update({
        where: {
            id: id as string,
        },
        data: updateData,
    });
    return updatedQuestion
}

export async function getAllQuestions(filter?: GetAllQuestionsFilter) {
    if (!filter) {
        return await prisma.question.findMany()
    }
    const questions = await prisma.question.findMany({
        where: {
            AND: [
                ...(filter.cognitive_level ? [{ cognitive_level: filter.cognitive_level }] : []),
                ...(filter.difficulty_level ? [{ difficulty_level: filter.difficulty_level }] : []),
                ...(filter.course_name ? [{ course_name: filter.course_name }] : []),
                ...(filter.question_text ? [{ question_text: { contains: filter.question_text, } }] : []),
                ...(filter.context_pages ? [{
                    context_pages: {
                        hasSome: filter.context_pages
                    }
                }] : []),
            ],
        },
    });

    return questions
}

export async function getMetadata() {
    const questionData = await prisma.question.findMany({
        select: {
            context_pages: true,
            course_name: true
        },
    });

    const count = await prisma.question.count()

    const allPageNumbers = [
        ...new Set(questionData.flatMap((question) => question.context_pages)),
    ].sort((a, b) => a - b);

    const allTopics = [
        ...new Set(questionData.flatMap((question) => question.course_name.toLowerCase())),
    ].sort();

    const metadata: Metadata = {
        total_questions: count,
        coverage_pages: allPageNumbers,
        primary_topics: allTopics,
    }
    return metadata
}

export async function getCourseNames() {
    const uniqueCourseNames = await prisma.question.findMany({
        distinct: ['course_name'],
        select: {
            course_name: true,
        },
    });

    const courseNamesArray = uniqueCourseNames.map((question) => question.course_name).sort();
    return courseNamesArray
}

export async function getReferencePages() {
    const uniquePageReferences = await prisma.supportingEvidence.findMany({
        distinct: ["page_reference"],
        select: {
            page_reference: true
        },
    });

    const pageReferenceArray = uniquePageReferences.map((question) => question.page_reference).sort((a, b) => a - b);
    return pageReferenceArray
}