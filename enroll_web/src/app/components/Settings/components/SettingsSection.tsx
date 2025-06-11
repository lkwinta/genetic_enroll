import React, { useState, ReactNode, FC} from 'react';
import { ChevronDown, ChevronRight} from 'lucide-react'

import '../styles/settings.css';

interface SettingsSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

const SettingsSection: FC<SettingsSectionProps> = ({ title, icon, children, defaultExpanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  return (
    <div className="settings-section settings-bg-secondary settings-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-primary hover:settings-bg-tertiary"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isExpanded && (
        <div className="settings-section-drawer">
          {children}
        </div>
      )}
    </div>
  );
};

export default SettingsSection;