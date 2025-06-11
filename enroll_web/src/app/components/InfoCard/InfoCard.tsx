import React from 'react';

import { 
  AlertCircle,
  Info,
} from 'lucide-react';

import './styles/info_card.css';

type InfoCardType = 'info' | 'warning';

interface InfoCardProps {
  type: InfoCardType;
  title: string;
  message: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ type, title, message }) => (
  <div className={`${type} info-card`}>
    <div className="flex gap-3">
      {type === 'info' ? (
        <Info className="info-icon" size={16} />
      ) : (
        <AlertCircle className="warning-icon" size={16} />
      )}
      <div>
        <h4 className={`${type}`}>
          {title}
        </h4>
        <p className={`${type}`}>
          {message}
        </p>
      </div>
    </div>
  </div>
);

export type { InfoCardProps, InfoCardType };
export default InfoCard;