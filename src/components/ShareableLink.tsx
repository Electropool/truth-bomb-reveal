
import { useState, useEffect } from "react";
import { formatShareableUrl } from "@/utils/dareUtils";
import { Share, Copy, Facebook, Instagram, Twitter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ShareableLinkProps {
  dareId: string;
}

const ShareableLink = ({ dareId }: ShareableLinkProps) => {
  const [copied, setCopied] = useState(false);
  const shareableUrl = formatShareableUrl(dareId);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    toast("Link copied to clipboard! Share it with your friends!", {
      duration: 3000,
    });
  };

  const shareOnSocial = async (platform?: string) => {
    const message = "Send me an anonymous message! I dare you to be honest 🙊";
    
    if (platform) {
      let shareUrl = "";
      
      switch (platform) {
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodeURIComponent(message + " " + shareableUrl)}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}&quote=${encodeURIComponent(message)}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message + " " + shareableUrl)}`;
          break;
        case "instagram":
          // Instagram doesn't have a direct share URL, we'll copy to clipboard
          copyToClipboard();
          toast("Link copied! Now paste it in your Instagram story 📸", {
            duration: 3000,
          });
          return;
        case "snapchat":
          // Snapchat doesn't have a direct share URL, we'll copy to clipboard
          copyToClipboard();
          toast("Link copied! Now paste it in your Snapchat 👻", {
            duration: 3000,
          });
          return;
        default:
          break;
      }
      
      if (shareUrl) {
        window.open(shareUrl, "_blank");
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: "Secret Message Dare 👀",
          text: message,
          url: shareableUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const socialPlatforms = [
    { name: "WhatsApp", icon: <MessageSquare className="w-5 h-5" />, id: "whatsapp", color: "from-green-600 to-green-700" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, id: "instagram", color: "from-pink-600 to-purple-600" },
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, id: "facebook", color: "from-blue-600 to-blue-700" },
    { name: "Snapchat", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6c-2.133 0-3.871 1.719-3.871 3.844 0 .177.016.35.031.523-3.214-.152-6.036-1.719-7.955-4.074a3.844 3.844 0 0 0-.523 1.93c0 1.333.684 2.51 1.719 3.195a3.87 3.87 0 0 1-1.762-.488v.047c0 1.867 1.332 3.422 3.092 3.777a3.882 3.882 0 0 1-1.016.133c-.25 0-.492-.023-.734-.07.496 1.527 1.91 2.645 3.594 2.676A7.794 7.794 0 0 1 0 18.138a11.03 11.03 0 0 0 5.977 1.75c7.16 0 11.072-5.93 11.072-11.074 0-.168-.004-.336-.012-.504a7.875 7.875 0 0 0 1.941-2.008 7.75 7.75 0 0 1-2.234.613 3.89 3.89 0 0 0 1.707-2.145 7.766 7.766 0 0 1-2.47.942 3.883 3.883 0 0 0-6.621 2.656c0 .305.035.598.102.883a11.025 11.025 0 0 1-8-4.059 3.882 3.882 0 0 0 1.2 5.184 3.85 3.85 0 0 1-1.758-.484v.047c0 1.879 1.335 3.447 3.106 3.805a3.888 3.888 0 0 1-1.75.066 3.894 3.894 0 0 0 3.629 2.698 7.789 7.789 0 0 1-4.82 1.66c-.313 0-.621-.019-.93-.055a11.01 11.01 0 0 0 5.96 1.747c7.154 0 11.067-5.93 11.067-11.075 0-.168-.004-.334-.012-.5a7.896 7.896 0 0 0 1.94-2.012 7.737 7.737 0 0 1-2.232.614z"/></svg>, id: "snapchat", color: "from-yellow-400 to-yellow-500" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, id: "twitter", color: "from-blue-400 to-sky-500" },
    { name: "Copy Link", icon: <Copy className="w-5 h-5" />, id: "copy", color: "from-purple-500 to-indigo-600", action: copyToClipboard },
  ];

  return (
    <div className="w-full flex flex-col items-center space-y-4 animate-bounce-in">
      <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 border-purple-500/20 w-full max-w-md">
        <div className="mb-2 text-sm text-purple-300 font-semibold">Your shareable link:</div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={shareableUrl}
            readOnly
            className="flex-1 py-2 px-3 rounded bg-gray-900/70 text-purple-100 text-sm truncate border border-purple-500/30 focus:outline-none focus:border-purple-500"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button
            variant="secondary"
            size="icon"
            className="shrink-0 group bg-purple-700 hover:bg-purple-600"
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy</span>
            {copied ? "✓" : "📋"}
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              className="w-full py-6 text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg"
              onClick={() => shareOnSocial()}
            >
              <Share className="w-5 h-5" />
              Share My Dare
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2 bg-gray-800 border border-purple-500/30 text-white">
            <div className="text-sm font-medium text-center text-purple-200 mb-3">
              📤 Share your link on:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant="outline"
                  className={`justify-start text-sm border-purple-500/30 hover:border-purple-500 hover:bg-gradient-to-r ${platform.color} hover:text-white transition-all duration-300`}
                  onClick={platform.action || (() => shareOnSocial(platform.id))}
                >
                  <span className="mr-2">{platform.icon}</span>
                  {platform.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <p className="text-center text-sm text-purple-300 mt-2 max-w-md">
        Share this link with friends and they can send you anonymous messages! Come back to this page to see what they've said 👀
      </p>
    </div>
  );
};

export default ShareableLink;
