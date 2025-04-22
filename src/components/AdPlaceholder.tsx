
import React from 'react';

interface AdPlaceholderProps {
  position: 'top' | 'middle' | 'bottom';
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ position, className = '' }) => {
  return (
    <div 
      className={`w-full p-3 border-2 border-dashed border-purple-500/40 bg-purple-900/20 rounded-lg text-center transition-all duration-300 hover:bg-purple-800/30 hover:border-purple-400/50 ${className}`}
      style={{ minHeight: position === 'top' ? '70px' : position === 'middle' ? '100px' : '90px' }}
    >
      <p className="text-xs text-purple-300 font-medium">Ad Space ({position})</p>
    </div>
  );
};

export default AdPlaceholder;
