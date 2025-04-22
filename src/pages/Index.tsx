
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ShareableLink from '@/components/ShareableLink';
import MessageDisplay from '@/components/MessageDisplay';
import BackgroundGradient from '@/components/BackgroundGradient';
import { 
  createNewDare, 
  hasActiveDare, 
  getMyDareId, 
  getMessages, 
  DareMessage,
  clearDare 
} from '@/utils/dareUtils';

const Index = () => {
  const [dareId, setDareId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DareMessage[]>([]);
  const [hasExistingDare, setHasExistingDare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkExistingDare();
  }, []);

  const checkExistingDare = () => {
    setIsLoading(true);
    
    const hasDare = hasActiveDare();
    setHasExistingDare(hasDare);
    
    if (hasDare) {
      const currentDareId = getMyDareId();
      setDareId(currentDareId);
      
      if (currentDareId) {
        const dareMessages = getMessages(currentDareId);
        setMessages(dareMessages);
      }
    }
    
    setIsLoading(false);
  };

  const handleCreateDare = () => {
    const newDareId = createNewDare();
    setDareId(newDareId);
    setHasExistingDare(true);
    setMessages([]);
  };

  const handleResetDare = () => {
    clearDare();
    setDareId(null);
    setMessages([]);
    setHasExistingDare(false);
  };

  const handleRefreshMessages = () => {
    if (dareId) {
      const updatedMessages = getMessages(dareId);
      setMessages(updatedMessages);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-rounded">
      <BackgroundGradient />
      <div className="container max-w-md mx-auto py-8 px-4 flex flex-col min-h-screen">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 relative inline-block">
            <span className="animate-float inline-block">👀</span>
            <span className="mx-2">Can You Handle the Truth?</span>
            <span className="animate-float inline-block">👀</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Get anonymous messages from your friends.
          </p>
        </header>

        <main className="flex-1 flex flex-col items-center space-y-8">
          {!hasExistingDare ? (
            <div className="flex flex-col items-center text-center space-y-6 py-8 w-full animate-bounce-in">
              <p className="text-xl">
                Create your own truth dare and share it with friends!
              </p>
              <div className="flex gap-4 mt-4">
                <Button 
                  onClick={handleCreateDare}
                  className="py-6 px-8 text-xl font-bold"
                  size="lg"
                >
                  Start Your Dare
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ShareableLink dareId={dareId || ''} />
              
              <div className="w-full mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Your Messages</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefreshMessages}
                    >
                      Refresh
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleResetDare}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                <MessageDisplay messages={messages} />
              </div>
            </>
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground py-4">
          <p>Made with fun &amp; honesty 💖</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
