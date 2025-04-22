
import React from 'react';
import { Facebook, Twitter, MessageSquare, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface SocialShareButtonsProps {
  shareableUrl: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ shareableUrl }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    toast.success('Link copied to clipboard!');
  };

  const openShareUrl = (baseUrl: string) => {
    const url = baseUrl + encodeURIComponent(shareableUrl);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const text = "Send me an anonymous message! I won't know who sent it 🤫";
    const url = `https://wa.me/?text=${encodeURIComponent(text + " " + shareableUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Share on Facebook
  const shareOnFacebook = () => {
    openShareUrl('https://www.facebook.com/sharer/sharer.php?u=');
  };

  // Share on Twitter
  const shareOnTwitter = () => {
    const text = "Send me an anonymous message! I won't know who sent it 🤫";
    openShareUrl(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 my-3">
      <Button 
        onClick={shareOnWhatsApp} 
        variant="outline" 
        size="sm"
        className="bg-green-600/10 hover:bg-green-600/20 border-green-600/30 text-green-200"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      
      <Button 
        onClick={shareOnFacebook} 
        variant="outline" 
        size="sm"
        className="bg-blue-600/10 hover:bg-blue-600/20 border-blue-600/30 text-blue-200"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>
      
      <Button 
        onClick={shareOnTwitter} 
        variant="outline" 
        size="sm"
        className="bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/30 text-sky-200"
      >
        <Twitter className="w-4 h-4 mr-2" />
        Twitter
      </Button>
      
      <Button 
        onClick={handleCopyLink} 
        variant="outline" 
        size="sm"
        className="bg-purple-600/10 hover:bg-purple-600/20 border-purple-600/30 text-purple-200"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
};

export default SocialShareButtons;
