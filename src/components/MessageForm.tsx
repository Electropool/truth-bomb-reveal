
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please write a message first');
      return;
    }
    
    setSending(true);
    
    try {
      saveMessage(dareId, message.trim());
      
      // Show success alert instead of just a toast
      setShowSuccess(true);
      
      setMessage('');
      setSending(false);
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('Something went wrong. Please try again.');
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
            className="text-lg font-semibold flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Write your anonymous message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Be honest, they can handle it! 👀"
            className="w-full p-3 rounded-lg border-2 border-muted min-h-[120px] focus:border-primary focus:ring-primary"
            maxLength={200}
            required
          />
          <div className="text-xs text-right text-muted-foreground">
            {message.length}/200 characters
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6 text-lg font-bold flex items-center gap-2"
          disabled={sending || !message.trim()}
        >
          <Send className="w-5 h-5" />
          Send Anonymous Message
        </Button>
      </form>
      
      <div className="text-center space-y-2">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-muted"></div>
          <span className="flex-shrink mx-4 text-muted-foreground">Want to try it yourself?</span>
          <div className="flex-grow border-t border-muted"></div>
        </div>
        
        <Button
          variant="outline"
          className="w-full"
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
