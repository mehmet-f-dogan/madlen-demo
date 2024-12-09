"use client";

import React, { useState } from 'react';
import { createQuestions, deleteAllQuestions, getAllQuestions } from './db/functions';
import { Question } from '@prisma/client';

interface FileUploadComponentProps {
    onLoad: (questions: Question[]) => void;
  }

const FileUploadComponent:  React.FC<FileUploadComponentProps> = ({
    onLoad
}) => {
    const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const filePromises = Array.from(files).map((file) => {
            return new Promise<Questionnaire>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const jsonObject = JSON.parse(reader.result as string);
                        resolve(jsonObject);
                    } catch (error) {
                        reject(new Error(`Error parsing JSON from file: ${file.name}`));
                    }
                };
                reader.onerror = () => {
                    reject(new Error(`Error reading file: ${file.name}`));
                };
                reader.readAsText(file);
            });
        });

        Promise.all(filePromises)
            .then((newQuestionSets) => {
                setQuestionnaires(newQuestionSets);
                deleteAllQuestions().then(async () => {
                    await createQuestions(newQuestionSets.flatMap((set) => set.questions))
                    onLoad(await getAllQuestions())
                });
            });
    };

    return (
        <div className="">
            <button className="relative inline-block">
                <label 
                    htmlFor="file-input" 
                    className="px-3 py-3 text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                >
                    Select JSON Files
                </label>
            </button>
            <input
                id="file-input"
                type="file"
                multiple
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FileUploadComponent;
