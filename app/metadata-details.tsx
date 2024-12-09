import Link from "next/link";
import { Metadata } from "./types";

interface MetadataProps {
    metadata: Metadata;
}

const MetadataDetails: React.FC<MetadataProps> = ({ metadata }) => {
    return (
        <div className="max-w-sm mx-auto mt-8 bg-white p-4 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Metadata Details</h2>

            <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span className="text-sm">Total Questions:</span>
                    <span className="font-medium text-gray-800">{metadata.total_questions}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span className="text-sm">Coverage Pages:</span>
                    <div className="text-sm text-gray-800">
                        {metadata.coverage_pages.length > 0 ? (
                            <ul className="list-none">
                                {metadata.coverage_pages.map((page, index) => (
                                    <li key={index} >
                                        <Link target="_blank" className="hover:underline m-2" href={"/pdf/" + page}>{page}</Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span>No coverage pages available</span>
                        )}
                    </div>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span className="text-sm">Primary Topics:</span>
                    <div className="text-sm text-gray-800">
                        {metadata.primary_topics.length > 0 ? (
                            <ul className="list-none">
                                {metadata.primary_topics.map((topic, index) => (
                                    <li key={index}>{topic}</li>
                                ))}
                            </ul>
                        ) : (
                            <span>No primary topics available</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetadataDetails