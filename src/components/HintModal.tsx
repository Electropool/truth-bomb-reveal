
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, ThumbsUp } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageTimestamp: string;
}

const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, messageTimestamp }) => {
  const [hintUnlocked, setHintUnlocked] = useState(false);
  
  const handleBuyPremium = () => {
    // This would redirect to a payment page in a real implementation
    window.alert("This would take you to a payment page in a real implementation");
  };
  
  const handleRateUs = () => {
    // For demonstration, we'll simulate unlocking the hint after clicking this
    window.open("https://disboard.org/server/your-server-id", "_blank");
    setHintUnlocked(true);
  };
  
  const formatTimestamp = (timestamp: string): string => {
    // Convert to IST timezone (UTC+5:30)
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium', 
      timeStyle: 'short' 
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-gradient-glow">
            {hintUnlocked ? '🔓 Hint Unlocked!' : '🔒 Message Hint'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {hintUnlocked ? (
            <div className="text-center animate-bounce-in">
              <p className="text-lg text-purple-200 mb-3">This message was sent at:</p>
              <p className="text-xl font-bold text-pink-300 p-3 bg-pink-900/20 rounded-lg">
                {formatTimestamp(messageTimestamp)} (IST)
              </p>
              <p className="mt-4 text-sm text-purple-300">
                Thanks for your support! 💜
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg mb-4 text-purple-200">
                Want to know <span className="font-bold text-pink-300">when</span> this message was sent? ⏰ <br/>
                Unlock hint now!
              </p>
              
              <div className="flex flex-col gap-3 mt-6">
                <Button 
                  onClick={handleBuyPremium}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-2"
                >
                  🛒 Buy Premium
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-purple-500/30"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-purple-400">Or</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={handleRateUs}
                  className="border-purple-500 text-purple-200 hover:bg-purple-900/50 py-2"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  <span>Rate Us & Unlock</span>
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HintModal;
