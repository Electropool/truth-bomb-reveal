
import React from 'react';

interface AdPlaceholderProps {
  position: 'top' | 'middle' | 'bottom';
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ position, className = '' }) => {
  return (
    <div 
      className={`w-full p-2 border border-dashed border-purple-500/30 bg-purple-900/20 rounded-lg text-center ${className}`}
      style={{ minHeight: position === 'top' ? '60px' : position === 'middle' ? '100px' : '90px' }}
    >
      <p className="text-xs text-purple-400">Ad Space ({position})</p>
    </div>
  );
};

export default AdPlaceholder;
