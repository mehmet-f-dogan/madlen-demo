"use client"

import React, { useState } from "react";

interface EditQuestionModalProps {
  isOpen: boolean;
  selectedQuestion: any;
  onClose: () => void;
  onSave: (updatedQuestion: any) => void;
  onDelete: (questionId: string) => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  selectedQuestion,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !selectedQuestion) return null;

  const [updatedQuestion, setUpdatedQuestion] = useState({...selectedQuestion})

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(updatedQuestion);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    const value = e.target.value;
    setUpdatedQuestion({ ...updatedQuestion, [field]: value })
  };

  const handleDelete = () => {
    if (updatedQuestion.id) onDelete(updatedQuestion.id);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 text-black">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <h2 className="text-xl mb-4">Edit Question</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block mb-2">Question Text</label>
            <input
              type="text"
              value={updatedQuestion.question_text}
              onChange={(e) => handleChange(e, "question_text")}
              className="p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Difficulty Level</label>
            <select
              value={updatedQuestion.difficulty_level}
              onChange={(e) => handleChange(e, "difficulty_level")}
              className="p-2 border rounded w-full"
            >
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Cognitive Level</label>
            <select
              value={updatedQuestion.cognitive_level}
              onChange={(e) => handleChange(e, "cognitive_level")}
              className="p-2 border rounded w-full"
            >
              <option value="knowledge">Knowledge</option>
              <option value="comprehension">Comprehension</option>
              <option value="application">Application</option>
              <option value="analysis">Analysis</option>
              <option value="synthesis">Synthesis</option>
              <option value="evaluation">Evaluation</option>
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Question
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EditQuestionModal;
