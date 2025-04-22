
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ShareableLink from '@/components/ShareableLink';
import MessageDisplay from '@/components/MessageDisplay';
import BackgroundGradient from '@/components/BackgroundGradient';
import AdPlaceholder from '@/components/AdPlaceholder';
import { KeyRound } from 'lucide-react';
import { 
  createNewDare, 
  hasActiveDare, 
  getMyDareId, 
  getMessages, 
  DareMessage,
  clearDare 
} from '@/utils/dareUtils';
import { getPremiumStatus } from '@/utils/premiumUtils';

const Index = () => {
  const [dareId, setDareId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DareMessage[]>([]);
  const [hasExistingDare, setHasExistingDare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkExistingDare();
    
    const premiumStatus = getPremiumStatus();
    setIsPremium(premiumStatus.active);
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
          <Button variant="ghost" size="sm" className="text-purple-300 hover:bg-purple-900/30">
            <KeyRound className="w-4 h-4 mr-1" /> Admin
          </Button>
        </Link>
      </div>
      
      <div className="container max-w-md mx-auto py-8 px-4 flex flex-col min-h-screen">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center mb-2">
            <img 
              src="https://placeholder.pics/svg/40x40/8B5CF6/FFFFFF-8B5CF6/EnderHOST" 
              alt="EnderHOST" 
              className="w-10 h-10 mr-2" 
            />
            <h1 className="text-4xl font-bold relative inline-block text-gradient-glow">
              <span className="animate-float inline-block">😱</span>
              <span className="mx-2">Your Friends Have Something to Say... Anonymously</span>
              <span className="animate-float inline-block">😱</span>
            </h1>
          </div>
          <p className="text-purple-200 text-lg">
            Create your own secret message dare & watch what happens!
          </p>
        </header>
        
        {/* Top Ad Space */}
        <AdPlaceholder position="top" />

        <main className="flex-1 flex flex-col items-center space-y-8">
          {!hasExistingDare ? (
            <div className="flex flex-col items-center text-center space-y-6 py-8 w-full animate-bounce-in">
              <p className="text-xl text-purple-100">
                Ready to know what your friends <strong>really</strong> think about you?
              </p>
              <div className="flex gap-4 mt-4">
                <Button 
                  onClick={handleCreateDare}
                  className="py-6 px-8 text-xl font-bold neon-button"
                  size="lg"
                >
                  🎯 Start Your Dare
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ShareableLink dareId={dareId || ''} />
              
              <div className="w-full mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-purple-100">Your Secret Messages</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRefreshMessages}
                      className="border-purple-500 text-purple-200 hover:bg-purple-900"
                    >
                      Refresh
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleResetDare}
                      className="text-pink-300 hover:bg-pink-900/30"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                
                {/* Middle Ad Space */}
                {messages.length > 2 && <AdPlaceholder position="middle" className="my-4" />}
                
                <MessageDisplay messages={messages} />
              </div>
            </>
          )}
        </main>

        {/* Bottom Ad Space */}
        <AdPlaceholder position="bottom" className="mt-8" />

        <footer className="mt-12 text-center text-sm text-purple-300 py-4">
          <div className="flex justify-center space-x-4 mb-2">
            <a href="https://discord.gg/enderhost" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200">💬 Discord</a>
            <a href="mailto:support@enderhost.in" className="hover:text-purple-200">📧 Support</a>
          </div>
          <p>Made with curiosity & mystery by <a href="https://enderhost.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-200">EnderHOST</a> 💖</p>
          <div className="flex justify-center space-x-3 mt-2 text-xs text-purple-400">
            <a href="#" className="hover:text-purple-300">Terms</a>
            <a href="#" className="hover:text-purple-300">Privacy</a>
            <a href="#" className="hover:text-purple-300">About</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
