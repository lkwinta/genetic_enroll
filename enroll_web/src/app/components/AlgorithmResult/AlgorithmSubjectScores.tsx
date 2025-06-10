'use client'

import React from "react";
import AlgorithmResultsSection from "./components/AlgorithmResultsSection";
import AlgorithmSubjectScoresPlot, { SubjectScore } from "./components/AlgorithmSubjectScoresPlot";


export interface AlgorithmSubjectScoresProps {
    scores?: SubjectScore[];
}

const AlgorithmSubjectScores: React.FC<AlgorithmSubjectScoresProps> = ({ scores }) => {   
    return (
        <AlgorithmResultsSection
            title="Scores Per Subject"
            viewButton={false}
            viewButtonText="View Full Results"
        >
            <AlgorithmSubjectScoresPlot scores={scores} />
        </AlgorithmResultsSection>
    );
}

export default AlgorithmSubjectScores;