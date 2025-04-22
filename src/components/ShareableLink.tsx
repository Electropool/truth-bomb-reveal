
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { formatShareableUrl } from '@/utils/dareUtils';
import SocialShareButtons from '@/components/SocialShareButtons';

interface ShareableLinkProps {
  dareId: string;
}

const ShareableLink: React.FC<ShareableLinkProps> = ({ dareId }) => {
  const [isCopied, setIsCopied] = useState(false);
  const shareableUrl = formatShareableUrl(dareId);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setIsCopied(true);
    toast.success('Link copied to clipboard!');
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div className="w-full p-5 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border-2 border-purple-500/20 animate-bounce-in hover:border-purple-500/40 transition duration-300">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gradient-glow mb-1">Your Secret Link is Ready! 🔗</h2>
        <p className="text-purple-200 text-sm">
          Share this link with friends to see what they <strong>really</strong> think about you!
        </p>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Input 
          value={shareableUrl}
          readOnly
          className="bg-gray-900/70 border-purple-500/30 text-purple-100 font-medium text-sm"
        />
        <Button 
          onClick={handleCopyLink}
          variant="outline" 
          size="icon"
          className={`shrink-0 border-purple-500/40 ${isCopied ? 'bg-green-800/30 text-green-300' : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/50'}`}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center mb-2">
        <p className="text-sm font-medium text-purple-300 flex items-center justify-center">
          <Share2 className="w-4 h-4 mr-1" /> Share on:
        </p>
        <SocialShareButtons shareableUrl={shareableUrl} />
      </div>
    </div>
  );
};

export default ShareableLink;
