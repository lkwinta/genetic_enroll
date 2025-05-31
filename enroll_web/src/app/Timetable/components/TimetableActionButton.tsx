import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  variant: 'save' | 'cancel' | 'edit' | 'delete' | 'add';
  children: React.ReactNode;
  size?: 'sm' | 'xs';
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, variant, children, size = 'xs' }) => {
  const baseClasses = `flex items-center gap-1 rounded transition-all ${size === 'xs' ? 'px-2 py-1 text-xs' : 'p-1'}`;
  
  const variants = {
    save: 'bg-green-500 text-white hover:bg-green-600',
    cancel: 'bg-gray-500 text-white hover:bg-gray-600',
    edit: 'bg-blue-500 text-white hover:bg-blue-600',
    delete: 'bg-red-500 text-white hover:bg-red-600',
    add: 'border border-dashed text-gray-500 border-gray-300 hover:border-blue-400 hover:text-blue-500 dark:text-gray-400 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:text-blue-400'
  };
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

export default ActionButton;
