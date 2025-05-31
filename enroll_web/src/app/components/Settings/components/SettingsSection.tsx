import React, { useState } from 'react';
import { ChevronDown, ChevronRight} from 'lucide-react'

import '../styles/settings.css';

const SettingsSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, icon, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  return (
    <div className="settings-bg-secondary rounded-xl border settings-border shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between settings-text-primary hover:settings-bg-tertiary transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 pt-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export default SettingsSection;