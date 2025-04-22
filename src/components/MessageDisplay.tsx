
import React from 'react';
import { DareMessage } from '@/utils/dareUtils';

interface MessageDisplayProps {
  messages: DareMessage[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="w-full p-8 bg-white rounded-xl shadow-sm border-2 border-muted animate-pulse-light text-center">
        <p className="text-lg font-semibold text-muted-foreground">No messages yet... 👀</p>
        <p className="text-sm text-muted-foreground mt-2">
          Share your link with friends to start getting anonymous messages!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 max-h-[60vh] overflow-y-auto p-2">
      <h2 className="text-xl font-bold text-center mb-4">Your Messages</h2>
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className="p-4 bg-white rounded-xl shadow-sm border-2 border-accent animate-bounce-in"
        >
          <div className="flex justify-between items-start mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-primary">
              Anonymous
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(msg.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="text-lg font-medium">{msg.message}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageDisplay;
