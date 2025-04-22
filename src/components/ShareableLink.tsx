
import { useState, useEffect } from "react";
import { formatShareableUrl } from "@/utils/dareUtils";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

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

  const shareOnSocial = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Can You Handle the Truth? 👀",
          text: "Send me an anonymous message! I dare you to be honest 🙊",
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

  return (
    <div className="w-full flex flex-col items-center space-y-4 animate-bounce-in">
      <div className="p-4 bg-white rounded-xl border-2 border-primary/20 w-full max-w-md">
        <div className="mb-2 text-sm text-muted-foreground font-semibold">Your shareable link:</div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={shareableUrl}
            readOnly
            className="flex-1 py-2 px-3 rounded bg-muted text-sm truncate"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button
            variant="secondary"
            size="icon"
            className="shrink-0 group"
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy</span>
            {copied ? "✓" : "📋"}
          </Button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <Button 
          className="w-full py-6 text-lg font-bold flex items-center gap-2 bg-secondary hover:bg-secondary/90 transition-all"
          onClick={shareOnSocial}
        >
          <Share className="w-5 h-5" />
          Share My Dare
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-2 max-w-md">
        Share this link with friends and they can send you anonymous messages! Come back to this page to see what they've said 👀
      </p>
    </div>
  );
};

export default ShareableLink;
