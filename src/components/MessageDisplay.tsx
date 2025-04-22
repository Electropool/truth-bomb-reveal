
import React, { useState } from 'react';
import { DareMessage } from '@/utils/dareUtils';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import HintModal from '@/components/HintModal';

interface MessageDisplayProps {
  messages: DareMessage[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  const [openHintId, setOpenHintId] = useState<string | null>(null);

  const handleViewHint = (messageId: string) => {
    setOpenHintId(messageId);
  };

  const handleCloseHint = () => {
    setOpenHintId(null);
  };

  if (messages.length === 0) {
    return (
      <div className="w-full p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border-2 border-purple-500/20 animate-pulse-light text-center">
        <p className="text-lg font-semibold text-purple-300">No messages yet... 👀</p>
        <p className="text-sm text-purple-400 mt-2">
          Share your link with friends to start getting anonymous messages!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border-2 border-pink-500/20 animate-bounce-in hover:border-pink-500/40 transition duration-300"
        >
          <div className="flex justify-between items-start mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-200">
              Anonymous
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-pink-300 hover:bg-pink-900/30 hover:text-pink-200"
              onClick={() => handleViewHint(msg.id)}
            >
              <Eye className="h-3 w-3 mr-1" /> View Hint
            </Button>
          </div>
          <p className="text-lg font-medium text-white">{msg.message}</p>
          
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
  );
};

export default MessageDisplay;
