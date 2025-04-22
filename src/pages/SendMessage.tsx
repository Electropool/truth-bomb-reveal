
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageForm from '@/components/MessageForm';
import { toast } from '@/components/ui/sonner';
import BackgroundGradient from '@/components/BackgroundGradient';
import AdPlaceholder from '@/components/AdPlaceholder';

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
    
    // In a real app, we'd verify the dare ID with the server here
    // For now, we'll just assume it's valid if it exists
    setIsValidDare(true);
  }, [dareId, navigate]);

  if (isValidDare === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse text-center">
          <p className="text-xl text-purple-200 drop-shadow-md">Loading...</p>
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
      <div className="container max-w-md mx-auto py-8 px-4 flex flex-col min-h-screen">
        <header className="text-center mb-8">
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
        <AdPlaceholder position="top" />

        <main className="flex-1 flex flex-col items-center justify-center">
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
        <AdPlaceholder position="bottom" className="mt-8" />

        <footer className="mt-12 text-center text-sm text-purple-200 py-4">
          <p>Made with curiosity & mystery 💖</p>
        </footer>
      </div>
    </div>
  );
};

export default SendMessage;
