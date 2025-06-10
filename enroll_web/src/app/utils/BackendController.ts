import { Progress } from "../components/AlgorithmResult/AlgorithmStatus";
import { FitnessHistory } from "../components/AlgorithmResult/components/AlgorithmFitnessPlot";
import { StudentScore } from "../components/AlgorithmResult/components/AlgorithmScoresHistogram";
import { SubjectScore } from "../components/AlgorithmResult/components/AlgorithmSubjectScoresPlot";
import { SettingsState } from "../components/Settings/interfaces/AlgorithmSettings";
import { CSVInput, PreferencesRowType, ScheduleRowType } from "./ContextManager";

const BACKEND_URL = 'http://127.0.01:5000';

export type PostEndpoint = 'upload/settings' | 'upload/schedule' | 'upload/preferences' | 'start_evolution';
export type GetEndpoint = 'get_student_scores' | 'get_progress' | 'get_history' | 'get_best' | 'get_current_best' | 'get_subject_scores';

type PostEndpointToModel = {
    'upload/settings': SettingsState;
    'upload/schedule': CSVInput<ScheduleRowType>;
    'upload/preferences': CSVInput<PreferencesRowType>;
    'start_evolution': undefined;
}

type GetEndpointToModel = {
    'get_student_scores': { scores: StudentScore[] };
    'get_progress': { progress: Progress };
    'get_history': { history: FitnessHistory };
    'get_best': { fitness: number, individual: {type: string, csvString: string} };
    'get_current_best': { fitness: number, individual: {type: string, csvString: string} };
    'get_subject_scores': { scores: SubjectScore[] };
}

type BackendPostResponse = {
    message: string;
}

type BackendErrorResponse = {
    error: string;
}

async function sendToBackend<T extends PostEndpoint>(endpoint: T, data?: PostEndpointToModel[T]) : Promise<BackendPostResponse> {
    const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data ? data : {}),
    });

    if (!response.ok) {
        const errorData: BackendErrorResponse = await response.json();
        console.error(`Error sending data to ${endpoint}:`, response.statusText, errorData.error);

        throw new Error(`Failed to send data to ${endpoint}: ${response.statusText}`, {
            cause: errorData.error
        });
    }

    return response.json();
}

async function fetchFromBackend<T extends GetEndpoint>(endpoint: T): Promise<GetEndpointToModel[T]> {
    const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'GET'
    });

    if (!response.ok) {
        const errorData: BackendErrorResponse = await response.json();
        console.error(`Error fetching data from ${endpoint}:`, response.statusText, errorData.error);

        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`, {
            cause: errorData.error
        });
    }

    return response.json();
}

export {sendToBackend, fetchFromBackend};