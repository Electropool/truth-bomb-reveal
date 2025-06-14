
import React from 'react';
import AdBlock from './AdBlock';

interface AdPlaceholderProps {
  position: 'top' | 'middle' | 'bottom';
  className?: string;
  size?: '320x50' | '728x90' | '300x250';
  showReal?: boolean;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  position, 
  className = '', 
  size = '320x50',
  showReal = false 
}) => {
  const getAdConfig = (adSize: string) => {
    switch (adSize) {
      case '320x50':
        return {
          key: '6281042706de2cb9d9841c0d9967e8c6',
          width: 320,
          height: 50
        };
      case '728x90':
        return {
          key: '3671f7533d2dcdcc038a493dbb4f2eb1',
          width: 728,
          height: 90
        };
      case '300x250':
        return {
          key: 'd23e77c08ae258f98c14e38be8e1ef15',
          width: 300,
          height: 250
        };
      default:
        return {
          key: '6281042706de2cb9d9841c0d9967e8c6',
          width: 320,
          height: 50
        };
    }
  };

  const adConfig = getAdConfig(size);

  if (showReal) {
    return (
      <AdBlock
        adKey={adConfig.key}
        width={adConfig.width}
        height={adConfig.height}
        className={className}
      />
    );
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div 
        className="w-full max-w-sm p-3 border-2 border-dashed border-purple-500/50 bg-purple-900/20 rounded-lg text-center transition-all duration-300 hover:bg-purple-800/40 hover:border-purple-400/70"
        style={{ 
          minHeight: position === 'top' ? '70px' : position === 'middle' ? '100px' : '90px',
          width: `${adConfig.width}px`,
          maxWidth: '100%'
        }}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-xs text-purple-200 font-medium">
            Ad Space ({size})
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdPlaceholder;
