
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Clock, ExternalLink, KeyRound, Lock, ThumbsUp, Unlock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  getPremiumStatus, 
  redeemPremiumCode, 
  getRemainingPremiumTime 
} from '@/utils/premiumUtils';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageTimestamp: string;
}

const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, messageTimestamp }) => {
  const [step, setStep] = useState<'initial' | 'confirm' | 'redeem' | 'warning' | 'success' | 'unlocked'>('initial');
  const [premiumCode, setPremiumCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  
  useEffect(() => {
    const checkPremiumStatus = () => {
      const status = getPremiumStatus();
      if (status.active) {
        setIsPremium(true);
        setStep('unlocked');
        const timeRemaining = getRemainingPremiumTime();
        setRemainingTime(timeRemaining);
      }
    };
    
    checkPremiumStatus();
  }, []);
  
  const handleRedeemClick = () => {
    setStep('warning');
  };
  
  const handleConfirmRedeem = () => {
    setStep('redeem');
  };
  
  const handleCancelRedeem = () => {
    setStep('initial');
  };
  
  const handleSubmitCode = () => {
    if (!premiumCode.trim() || premiumCode.length !== 8) {
      setErrorMessage('Please enter a valid 8-character premium code.');
      return;
    }
    
    const result = redeemPremiumCode(premiumCode.trim());
    
    if (result.success) {
      setIsPremium(true);
      setStep('success');
      // After showing success for 2 seconds, show the hint
      setTimeout(() => {
        setStep('unlocked');
        const timeRemaining = getRemainingPremiumTime();
        setRemainingTime(timeRemaining);
      }, 2000);
    } else {
      setErrorMessage(result.message || 'Invalid code. Please try again.');
    }
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
      <DialogContent className="bg-gray-900 border-purple-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-gradient-glow">
            {step === 'unlocked' || step === 'success' ? '🔓 Hint Unlocked!' : '🔒 Message Hint'}
          </DialogTitle>
          {step !== 'unlocked' && step !== 'success' && (
            <DialogDescription className="text-purple-300">
              Discover when this message was sent to you.
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="py-4">
          {step === 'initial' && (
            <div className="text-center">
              <p className="text-lg mb-4 text-purple-200">
                Want to know <span className="font-bold text-pink-300">when</span> this message was sent? ⏰ <br/>
                Unlock with your premium code.
              </p>
              
              <div className="flex flex-col gap-3 mt-6">
                <Button 
                  onClick={handleRedeemClick}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-2"
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Use Premium Code
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
                  onClick={() => {
                    window.open("https://enderhost.in", "_blank");
                  }}
                  className="border-purple-500 text-purple-200 hover:bg-purple-900/50 py-2"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span>Get Premium Access</span>
                </Button>
              </div>
            </div>
          )}
          
          {step === 'warning' && (
            <div className="text-center space-y-4">
              <Alert className="bg-yellow-900/20 border-yellow-500/30 text-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Premium codes can only be used once and provide 3 days of access. This action cannot be undone.
                </AlertDescription>
              </Alert>
              
              <p className="text-purple-200 mt-2">
                Are you sure you want to redeem your premium code now?
              </p>
              
              <div className="flex gap-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCancelRedeem}
                  className="flex-1 border-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmRedeem}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
                >
                  Proceed
                </Button>
              </div>
            </div>
          )}
          
          {step === 'redeem' && (
            <div className="space-y-4">
              <p className="text-center text-purple-200 mb-2">
                Enter your 8-character premium code:
              </p>
              
              <div className="space-y-2">
                <Input
                  value={premiumCode}
                  onChange={(e) => {
                    setPremiumCode(e.target.value.toUpperCase());
                    setErrorMessage('');
                  }}
                  maxLength={8}
                  placeholder="XXXXXXXX"
                  className="bg-gray-800 border-purple-500/30 text-center text-lg tracking-widest placeholder:text-purple-500/50"
                />
                
                {errorMessage && (
                  <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                )}
              </div>
              
              <Button 
                onClick={handleSubmitCode}
                disabled={premiumCode.length !== 8}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Unlock Premium
              </Button>
              
              <div className="text-center text-xs text-purple-400 mt-2">
                Need help? Contact support for assistance.
              </div>
            </div>
          )}
          
          {step === 'success' && (
            <div className="text-center animate-bounce-in">
              <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <ThumbsUp className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-lg font-medium text-green-400">Premium Activated!</p>
              <p className="text-sm text-purple-300 mt-2">
                Your premium access is now active for 3 days.
              </p>
            </div>
          )}
          
          {step === 'unlocked' && (
            <div className="text-center animate-bounce-in">
              {remainingTime && (
                <div className="mb-4 p-2 bg-purple-900/30 rounded-lg border border-purple-500/20 flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-purple-300" />
                  <p className="text-xs text-purple-300">Premium: {remainingTime} remaining</p>
                </div>
              )}
              
              <p className="text-lg text-purple-200 mb-3">This message was sent at:</p>
              <p className="text-xl font-bold text-pink-300 p-3 bg-pink-900/20 rounded-lg">
                {formatTimestamp(messageTimestamp)} (IST)
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-center">
          {step === 'unlocked' && (
            <Button variant="ghost" onClick={onClose} className="text-purple-300">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HintModal;
