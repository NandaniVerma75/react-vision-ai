import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Image, Loader2, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image_url?: string;
  created_at: string;
}

interface ChatSidebarProps {
  messages: Message[];
  onSendMessage: (content: string, imageUrl?: string) => void;
  isLoading: boolean;
}

export const ChatSidebar = ({ messages, onSendMessage, isLoading }: ChatSidebarProps) => {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    // For now, we'll just pass the message without image upload
    // In a real implementation, you'd upload the image first and get a URL
    onSendMessage(message.trim());
    setMessage('');
    setImageFile(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-style formatting for code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const [lang, ...codeLines] = code.split('\n');
        const codeContent = codeLines.join('\n');
        
        return (
          <div key={index} className="my-3">
            <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-t border-l-2 border-primary">
              {lang || 'code'}
            </div>
            <pre className="bg-card p-3 rounded-b border border-t-0 border-l-2 border-primary overflow-x-auto">
              <code className="font-mono text-sm">{codeContent}</code>
            </pre>
          </div>
        );
      }
      
      return (
        <div key={index} className="whitespace-pre-wrap">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-card/20 border-r border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h2 className="font-semibold text-lg">Chat</h2>
        <p className="text-sm text-muted-foreground">
          Describe the component you want to create
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation to generate your first component!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  )}>
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <Card className={cn(
                    "p-3",
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border-border/50'
                  )}>
                    <div className="text-sm">
                      {formatMessage(msg.content)}
                    </div>
                    {msg.image_url && (
                      <img 
                        src={msg.image_url} 
                        alt="Uploaded" 
                        className="mt-2 max-w-full rounded border"
                      />
                    )}
                  </Card>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <Card className="p-3 bg-card border-border/50">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Generating component...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <form onSubmit={handleSubmit} className="space-y-3">
          {imageFile && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Image className="h-4 w-4" />
              <span className="text-sm flex-1 truncate">{imageFile.name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setImageFile(null)}
              >
                ×
              </Button>
            </div>
          )}
          
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the component you want to create..."
                className="min-h-[80px] resize-none pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute bottom-2 right-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={(!message.trim() && !imageFile) || isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Generating...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  );
};