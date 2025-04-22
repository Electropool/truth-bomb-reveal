import React, { useState, useEffect } from 'react';
import { DareMessage } from '@/utils/dareUtils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye } from 'lucide-react';
import HintModal from '@/components/HintModal';
import { getPremiumStatus, isPremiumExpiringSoon, getRemainingPremiumTime } from '@/utils/premiumUtils';

interface MessageDisplayProps {
  messages: DareMessage[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  const [openHintId, setOpenHintId] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  useEffect(() => {
    const checkPremiumStatus = () => {
      const status = getPremiumStatus();
      setIsPremium(status.active);
      setIsExpiringSoon(isPremiumExpiringSoon());
      
      if (status.active) {
        setRemainingTime(getRemainingPremiumTime());
      }
    };
    
    checkPremiumStatus();
    
    const intervalId = setInterval(checkPremiumStatus, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleViewHint = (messageId: string) => {
    setOpenHintId(messageId);
  };

  const handleCloseHint = () => {
    setOpenHintId(null);
  };

  if (messages.length === 0) {
    return (
      <div className="w-full p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border-2 border-purple-500/30 animate-pulse-light text-center">
        <p className="text-lg font-semibold text-purple-200 drop-shadow-md">No messages yet... 👀</p>
        <p className="text-sm text-purple-300 mt-2 drop-shadow-sm">
          Share your link with friends to start getting anonymous messages!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {isPremium && isExpiringSoon && (
        <Alert className="bg-yellow-900/30 border-yellow-500/40 text-yellow-100 mb-4 drop-shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your premium access expires soon! Only {remainingTime} remaining.
          </AlertDescription>
        </Alert>
      )}
      
      {isPremium && !isExpiringSoon && (
        <div className="bg-purple-900/30 border border-purple-500/40 rounded-lg py-2 px-3 text-center mb-4">
          <p className="text-xs text-purple-200 drop-shadow-sm">
            Premium Active • {remainingTime} remaining
          </p>
        </div>
      )}
      
      <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="p-4 bg-gray-800/60 backdrop-blur-md rounded-xl shadow-lg border-2 border-pink-500/30 animate-bounce-in hover:border-pink-500/50 transition duration-300 mb-4"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/60 text-purple-100 shadow-sm">
                Anonymous
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-pink-200 hover:bg-pink-900/40 hover:text-pink-100 shadow-sm"
                onClick={() => handleViewHint(msg.id)}
              >
                <Eye className="h-3 w-3 mr-1" /> View Hint
              </Button>
            </div>
            <p className="text-lg font-medium text-white drop-shadow-sm">{msg.message}</p>
            
            {/* Hint Modal */}
            {openHintId === msg.id && (
              <HintModal 
                isOpen={true} 
                onClose={handleCloseHint} 
                messageTimestamp={msg.timestamp}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageDisplay;
