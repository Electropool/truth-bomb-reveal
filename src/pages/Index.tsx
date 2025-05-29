
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ShareableLink from '@/components/ShareableLink';
import MessageDisplay from '@/components/MessageDisplay';
import BackgroundGradient from '@/components/BackgroundGradient';
import AdPlaceholder from '@/components/AdPlaceholder';
import { KeyRound, MessageSquare } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse text-center">
          <p className="text-xl text-purple-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-rounded text-white">
      <BackgroundGradient />
      
      {/* Admin Login Button */}
      <div className="fixed top-4 right-4 z-10">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="text-purple-200 hover:bg-purple-900/40 shadow-sm">
            <KeyRound className="w-4 h-4 mr-1" /> Admin
          </Button>
        </Link>
      </div>
      
      <div className="container max-w-md mx-auto py-8 px-4 flex flex-col min-h-screen items-center">
        <header className="text-center mb-8 w-full">
          <h1 className="text-4xl font-bold relative inline-block text-gradient-glow mb-3 drop-shadow-lg">
            <MessageSquare className="w-8 h-8 inline-block mr-2 mb-1" />
            <span>Your Friends Have Something to Say... Anonymously</span>
            <span className="animate-float inline-block ml-2">😱</span>
          </h1>
          <p className="text-purple-100 text-lg drop-shadow-md">
            Create your own secret message dare & watch what happens!
          </p>
        </header>
        
        {/* Top Ad Space */}
        <div className="w-full flex justify-center mb-8">
          <AdPlaceholder position="top" size="320x50" />
        </div>

        <main className="flex-1 flex flex-col items-center space-y-8 w-full">
          {!hasExistingDare ? (
            <div className="flex flex-col items-center text-center space-y-6 py-8 w-full animate-bounce-in">
              <p className="text-xl text-purple-100 drop-shadow-md">
                Ready to know what your friends <strong>really</strong> think about you?
              </p>
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleCreateDare}
                  className="py-6 px-8 text-xl font-bold neon-button text-white shadow-lg"
                  size="lg"
                >
                  🎯 Start Your Dare
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full flex justify-center">
                <ShareableLink dareId={dareId || ''} />
              </div>
              
              <div className="w-full mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-purple-100 drop-shadow-md">Your Secret Messages</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefreshMessages}
                      className="border-purple-500/40 text-purple-100 hover:bg-purple-900/40 shadow-sm"
                    >
                      Refresh
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleResetDare}
                      className="text-pink-200 hover:bg-pink-900/40 shadow-sm"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                
                {/* Middle Ad Space */}
                {messages.length > 2 && (
                  <div className="w-full flex justify-center mb-6">
                    <AdPlaceholder position="middle" size="300x250" />
                  </div>
                )}
                
                <MessageDisplay messages={messages} />
              </div>
            </>
          )}
        </main>

        {/* Bottom Ad Space */}
        <div className="w-full flex justify-center mt-8">
          <AdPlaceholder position="bottom" size="728x90" />
        </div>

        <footer className="mt-12 text-center text-sm text-purple-200 py-4 w-full">
          <div className="flex justify-center space-x-4 mb-2">
            <a href="https://discord.gg/enderhost" target="_blank" rel="noopener noreferrer" className="hover:text-purple-100 transition-colors">💬 Discord</a>
            <a href="mailto:support@enderhost.in" className="hover:text-purple-100 transition-colors">📧 Support</a>
          </div>
          <p>Made with curiosity & mystery by <a href="https://enderhost.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-100 transition-colors">EnderHOST</a> 💖</p>
          <div className="flex justify-center space-x-3 mt-2 text-xs text-purple-300">
            <a href="#" className="hover:text-purple-200 transition-colors">Terms</a>
            <a href="#" className="hover:text-purple-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-200 transition-colors">About</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
