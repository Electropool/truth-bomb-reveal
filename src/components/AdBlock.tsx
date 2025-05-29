
import React, { useEffect } from 'react';

interface AdBlockProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

const AdBlock: React.FC<AdBlockProps> = ({ adKey, width, height, className = '' }) => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key': '${adKey}',
        'format': 'iframe',
        'height': ${height},
        'width': ${width},
        'params': {}
      };
    `;
    
    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = `//curledpastpatty.com/${adKey}/invoke.js`;

    const adDiv = document.getElementById(`ad-container-${adKey}`);
    if (adDiv) {
      adDiv.innerHTML = '';
      adDiv.appendChild(script1);
      adDiv.appendChild(script2);
    }

    return () => {
      // Cleanup when component unmounts
      const adDiv = document.getElementById(`ad-container-${adKey}`);
      if (adDiv) {
        adDiv.innerHTML = '';
      }
    };
  }, [adKey, width, height]);

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        id={`ad-container-${adKey}`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`, 
          maxWidth: '100%',
          overflow: 'hidden'
        }}
        className="ad-container"
      />
    </div>
  );
};

export default AdBlock;
