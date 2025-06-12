import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorBanner: React.FC<{error: string}> = ({ error }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 max-w-4xl mx-auto">
            <div className="flex items-center mb-2">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
                <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Error</h2>
            </div>
            <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
    );
}

export default ErrorBanner;