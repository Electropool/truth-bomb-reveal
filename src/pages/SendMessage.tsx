import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageForm from '@/components/MessageForm';
import { toast } from '@/components/ui/sonner';
import BackgroundGradient from '@/components/BackgroundGradient';
import AdPlaceholder from '@/components/AdPlaceholder';
import { validateDare } from '@/utils/dareUtils';

const SendMessage = () => {
  const { dareId } = useParams<{ dareId: string }>();
  const [isValidDare, setIsValidDare] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!dareId) {
      setIsValidDare(false);
      toast.error("Invalid dare link");
      navigate('/');
      return;
    }
    
    // Validate dare with server
    validateDare(dareId).then((exists) => {
      if (!exists) {
        setIsValidDare(false);
        toast.error("This dare link is invalid or has expired");
        navigate('/');
      } else {
        setIsValidDare(true);
      }
    }).catch((error) => {
      console.error('Error validating dare:', error);
      setIsValidDare(false);
      toast.error("Unable to validate dare link");
      navigate('/');
    });
  }, [dareId, navigate]);

  if (isValidDare === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse text-center">
          <p className="text-xl text-purple-200 drop-shadow-md">Validating dare link...</p>
        </div>
      </div>
    );
  }

  if (!isValidDare || !dareId) {
    return null; // We're redirecting, no need to render anything
  }

  return (
    <div className="min-h-screen font-rounded text-white">
      <BackgroundGradient />
      <div className="container max-w-md mx-auto py-8 px-4 flex flex-col min-h-screen items-center">
        <header className="text-center mb-8 w-full">
          <h1 className="text-4xl font-bold mb-2 text-gradient-glow drop-shadow-lg">
            <span className="animate-float inline-block">😱</span>
            <span className="mx-2">Secret Message</span>
            <span className="animate-float inline-block">😱</span>
          </h1>
          <p className="text-xl text-purple-100 drop-shadow-md">
            Someone is waiting for your honesty...
          </p>
        </header>

        {/* Top Ad Space */}
        <div className="w-full flex justify-center mb-8">
          <AdPlaceholder position="top" size="320x50" />
        </div>

        <main className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-md p-6 bg-gray-800/60 backdrop-blur-md rounded-xl shadow-lg border-2 border-purple-500/30 animate-bounce-in">
            <h2 className="text-2xl font-bold text-center mb-6 text-gradient-glow drop-shadow-md">
              Send an Anonymous Message
            </h2>
            <p className="text-center text-purple-100 mb-6 drop-shadow-sm">
              Your message will be 100% anonymous. They'll never know who sent it! 🤫
            </p>
            
            <MessageForm dareId={dareId} />
          </div>
        </main>

        {/* Bottom Ad Space */}
        <div className="w-full flex justify-center mt-8">
          <AdPlaceholder position="bottom" size="728x90" />
        </div>

        <footer className="mt-12 text-center text-sm text-purple-200 py-4 w-full">
          <p>Made with curiosity & mystery 💖</p>
        </footer>
      </div>
    </div>
  );
};

export default SendMessage;
