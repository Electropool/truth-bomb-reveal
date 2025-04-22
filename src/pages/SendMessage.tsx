
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessageForm from '@/components/MessageForm';
import { toast } from '@/components/ui/sonner';
import BackgroundGradient from '@/components/BackgroundGradient';

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isValidDare || !dareId) {
    return null; // We're redirecting, no need to render anything
  }

  return (
    <div className="min-h-screen font-rounded">
      <BackgroundGradient />
      <div className="container max-w-md mx-auto py-8 px-4 flex flex-col min-h-screen">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="animate-float inline-block">👀</span>
            <span className="mx-2">Truth Bomb</span>
            <span className="animate-float inline-block">👀</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Someone dared you to be honest!
          </p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm border-2 border-primary/10 animate-bounce-in">
            <h2 className="text-2xl font-bold text-center mb-6">
              Send an Anonymous Message
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Your message will be 100% anonymous. They'll never know who sent it! 🤫
            </p>
            
            <MessageForm dareId={dareId} />
          </div>
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground py-4">
          <p>Made with fun &amp; honesty 💖</p>
        </footer>
      </div>
    </div>
  );
};

export default SendMessage;
