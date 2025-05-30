import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { saveMessage } from '@/utils/dareUtils';
import { toast } from '@/components/ui/sonner';
import { MessageSquare, Send } from 'lucide-react';
import { SuccessAlert } from '@/components/AlertDialog';

interface MessageFormProps {
  dareId: string;
}

const MessageForm = ({ dareId }: MessageFormProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please write a message first');
      return;
    }
    
    setSending(true);
    
    try {
      await saveMessage(dareId, message.trim());
      
      // Show success alert instead of just a toast
      setShowSuccess(true);
      
      setMessage('');
      setSending(false);
    } catch (error: any) {
      console.error('Error saving message:', error);
      
      // Handle specific error messages from the server
      if (error.message.includes('already sent')) {
        toast.error('You have already sent a message for this dare');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
      
      setSending(false);
    }
  };
  
  const createMyOwnDare = () => {
    navigate('/');
  };
  
  return (
    <div className="w-full max-w-md space-y-6 animate-bounce-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="message" 
            className="text-lg font-semibold flex items-center gap-2 text-purple-200"
          >
            <MessageSquare className="w-5 h-5" />
            Write your anonymous message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Be honest, they can handle it! 👀"
            className="w-full p-3 rounded-lg border-2 border-purple-500/30 bg-gray-900/70 text-white min-h-[120px] focus:border-purple-500 focus:ring-purple-500 placeholder-purple-400"
            maxLength={200}
            required
          />
          <div className="text-xs text-right text-purple-400">
            {message.length}/200 characters
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6 text-lg font-bold flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg"
          disabled={sending || !message.trim()}
        >
          <Send className="w-5 h-5" />
          Send Anonymous Message
        </Button>
      </form>
      
      <div className="text-center space-y-2">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-purple-500/30"></div>
          <span className="flex-shrink mx-4 text-purple-400">Want to try it yourself?</span>
          <div className="flex-grow border-t border-purple-500/30"></div>
        </div>
        
        <Button
          variant="outline"
          className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-800/30 hover:border-purple-500"
          onClick={createMyOwnDare}
        >
          Create My Own Dare
        </Button>
      </div>

      {/* Success Alert Dialog */}
      <SuccessAlert
        open={showSuccess}
        setOpen={(open) => {
          setShowSuccess(open);
          if (!open) {
            // When the dialog is closed, navigate to create a new dare
            createMyOwnDare();
          }
        }}
        title="Message Sent!"
        description="Your message has been sent anonymously! The recipient won't know who sent it."
        action="Create My Own Dare"
      />
    </div>
  );
};

export default MessageForm;
