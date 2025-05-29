
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock } from 'lucide-react';
import AdPlaceholder from '@/components/AdPlaceholder';

interface TimestampModalProps {
  isOpen: boolean;
  onClose: () => void;
  timestamp: string;
  messageId: string;
}

const TimestampModal: React.FC<TimestampModalProps> = ({ 
  isOpen, 
  onClose, 
  timestamp, 
  messageId 
}) => {
  const formattedTime = new Date(timestamp).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-800/95 backdrop-blur-md border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-100">
            <Clock className="h-5 w-5" />
            Message Timestamp
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Timestamp Display */}
          <div className="text-center p-4 bg-purple-900/30 rounded-lg border border-purple-500/20">
            <p className="text-sm text-purple-200 mb-1">Message received on:</p>
            <p className="text-lg font-semibold text-white">{formattedTime}</p>
          </div>
          
          {/* Ad Space */}
          <div className="flex justify-center">
            <AdPlaceholder 
              position="middle" 
              size="300x250" 
              className="w-full max-w-[300px]"
              showReal={true}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimestampModal;
