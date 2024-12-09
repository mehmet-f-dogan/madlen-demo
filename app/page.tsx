"use client"

import { useEffect, useState } from "react";
import { deleteQuestion, getAllQuestions, getCourseNames, getMetadata, getReferencePages, updateQuestion } from "./db/functions";
import FileUploadComponent from "./file-upload-component";
import EditQuestionModal from "./edit-question-modal";
import Link from "next/link";
import { GetAllQuestionsFilter, Metadata } from "./types";
import MetadataDetails from "./metadata-details";
import { Question } from "@prisma/client";

export default function Home() {
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [availableDifficultyLevels, setAvailableDifficultyLevels] = useState<string[]>([]);

  const [selectedCognitiveLevel, setSelectedCognitiveLevel] = useState<string>("");
  const [availableCognitiveLevels, setAvailableCognitiveLevels] = useState<string[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [availableCourses, setAvailableCourses] = useState<string[]>([])

  const [selectedPageReference, setSelectedPageReference] = useState<number>(-1);
  const [availablePages, setAvailablePages] = useState<number[]>([])

  const [searchText, setSearchText] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const [metadata, setMetadata] = useState<Metadata>()

  const getQuestions = async () => {
    const data = await getAllQuestions()
    setFilteredQuestions(data);
  };

  useEffect(() => {
    const filter = {
      cognitive_level: selectedCognitiveLevel ? selectedCognitiveLevel : undefined,
      difficulty_level: selectedDifficulty ? selectedDifficulty : undefined,
      course_name: selectedCourse ? selectedCourse : undefined,
      question_text: searchText !== "" ? searchText : undefined,
      context_pages: selectedPageReference != -1 ? [selectedPageReference] : undefined
    } as any as GetAllQuestionsFilter
    getAllQuestions(filter).then((questions) => setFilteredQuestions(questions))
  }, [selectedDifficulty, selectedCognitiveLevel, searchText, selectedCourse, selectedPageReference]);

  useEffect(() => {
    setAvailableCognitiveLevels(Array.from(new Set(filteredQuestions.map((q) => q.cognitive_level))))
    setAvailableDifficultyLevels(Array.from(new Set(filteredQuestions.map((q) => q.difficulty_level))))
    setAvailableCourses(Array.from(new Set(filteredQuestions.map((q) => q.course_name))))
    setAvailablePages(Array.from(new Set(filteredQuestions.flatMap((q) => q.context_pages))).sort((a, b) => a - b))
  }, [filteredQuestions]);

  useEffect(() => {
    const task = async () => {
      const courses = await getCourseNames()
      const pages = await getReferencePages()
      setAvailableCourses(courses)
      setAvailablePages(pages)
      await getQuestions()
      const metadata = await getMetadata()
      setMetadata(metadata)
    }
    task()
  }, [])

  const handleFetchQuestions = async () => {
    setSelectedCognitiveLevel("")
    setSelectedDifficulty("")
    setSelectedCourse("")
    setSearchText("")
    setSelectedPageReference(-1)
    await getQuestions();
  };

  const handleEditClick = (question: any) => {
    setSelectedQuestion(question);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    const deleteResult = await deleteQuestion(questionId)
    if (deleteResult) {
      setFilteredQuestions(filteredQuestions.filter((q) => q.id !== questionId));
      handleCloseModal();
    } else {
      alert("Failed to delete the question.");
    }
  };

  const handleSaveQuestion = async (updatedQuestion: any) => {
    const updatedQuestionResult = await updateQuestion(updatedQuestion.id, updatedQuestion)
    if (updatedQuestionResult) {
      setFilteredQuestions(filteredQuestions.map((q) => (q.id === updatedQuestionResult.id ? updatedQuestionResult : q)));
      alert("Question updated.");
      handleCloseModal();
    } else {
      alert("Failed to update the question.");
    }
  };


  return (
    <main className="p-4">
      <div className="flex sm:space-x-4 flex-col sm:flex-row space-x-0">
        <FileUploadComponent onLoad={(questions) => {
          setFilteredQuestions(questions)
          getMetadata().then((metadata) => setMetadata(metadata))
        }} />
        <button
          onClick={handleFetchQuestions}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fetch All Questions
        </button>
      </div>

      <div className="mt-6 mb-4 space-y-4 text-black">
        <div className="flex sm:space-x-4 flex-col sm:flex-row space-x-0">
          <select
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="p-2 border rounded"
            value={selectedDifficulty}
          >
            <option value="">All Difficulty Levels</option>
            {availableDifficultyLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>

          {/* Cognitive Level Filter */}
          <select
            onChange={(e) => setSelectedCognitiveLevel(e.target.value)}
            className="p-2 border rounded"
            value={selectedCognitiveLevel}
          >
            <option value="">All Cognitive Levels</option>
            {availableCognitiveLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>

          {/* Course Filter */}
          <select
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="p-2 border rounded"
            value={selectedCourse}
          >
            <option value="">All Courses</option>
            {availableCourses.map((course) => (
              <option key={course} value={course}>
                {course.charAt(0).toUpperCase() + course.slice(1)}
              </option>
            ))}
          </select>

          {/* Page Filter */}
          <select
            onChange={(e) => {
              setSelectedPageReference(+ e.target.value)
            }}
            className="p-2 border rounded"
            value={selectedPageReference}
          >
            <option value="-1">All Pages</option>
            {availablePages.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* Search Text Filter */}
          <input
            type="text"
            onChange={(e) => setSearchText(e.target.value)}
            className="p-2 border rounded"
            placeholder="Search questions..."
            value={searchText}
          />
        </div>
      </div>

      {/* Table to display filtered questions */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">Question Text</th>
              <th className="px-4 py-2 border-b text-left">Difficulty</th>
              <th className="px-4 py-2 border-b text-left">Cognitive Level</th>
              <th className="px-4 py-2 border-b text-left">Course Name</th>
              <th className="px-4 py-2 border-b text-left">Context Pages</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50 hover:text-black">
                <td className="px-4 py-2 border-b">{q.id}</td>
                <td className="px-4 py-2 border-b">{q.question_text}</td>
                <td className="px-4 py-2 border-b">{q.difficulty_level}</td>
                <td className="px-4 py-2 border-b">{q.cognitive_level}</td>
                <td className="px-4 py-2 border-b">{q.course_name}</td>
                <td className="px-4 py-2 border-b">{q.context_pages.map((n: number) => {
                  return <Link target="_blank" className="hover:underline m-2" href={"/pdf/" + n} key={n}>{n}</Link>
                })}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(q);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing */}
      <EditQuestionModal
        isOpen={modalOpen}
        selectedQuestion={selectedQuestion}
        onClose={handleCloseModal}
        onSave={handleSaveQuestion}
        onDelete={handleDeleteQuestion}
      />
      {
        !metadata ? <></> : <MetadataDetails metadata={metadata} />
      }
    </main>
  );
};
