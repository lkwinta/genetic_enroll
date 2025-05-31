import React from 'react';

import '../styles/settings.css';

import { 
  AlertCircle,
  Info,
} from 'lucide-react';

const InfoCard: React.FC<{
  type: 'info' | 'warning';
  title: string;
  message: string;
}> = ({ type, title, message }) => (
  <div className={`p-4 rounded-lg border ${
    type === 'info' 
      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
  }`}>
    <div className="flex gap-3">
      {type === 'info' ? (
        <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={16} />
      ) : (
        <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" size={16} />
      )}
      <div>
        <h4 className={`text-sm font-medium ${
          type === 'info' 
            ? 'text-blue-900 dark:text-blue-100' 
            : 'text-yellow-900 dark:text-yellow-100'
        }`}>
          {title}
        </h4>
        <p className={`text-xs mt-1 ${
          type === 'info' 
            ? 'text-blue-700 dark:text-blue-300' 
            : 'text-yellow-700 dark:text-yellow-300'
        }`}>
          {message}
        </p>
      </div>
    </div>
  </div>
);

export default InfoCard;