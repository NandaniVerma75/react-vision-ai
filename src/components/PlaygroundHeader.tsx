import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, FolderOpen, User, LogOut, Edit3, Check, X } from 'lucide-react';

interface Session {
  id: string;
  name: string;
  description?: string;
  generated_jsx?: string;
  generated_css?: string;
  created_at: string;
  updated_at: string;
}

interface PlaygroundHeaderProps {
  currentSession: Session | null;
  onOpenSessionManager: () => void;
  onUpdateSession: (updates: Partial<Session>) => void;
}

export const PlaygroundHeader = ({ 
  currentSession, 
  onOpenSessionManager, 
  onUpdateSession 
}: PlaygroundHeaderProps) => {
  const { user, signOut } = useAuth();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = () => {
    setEditTitle(currentSession?.name || '');
    setIsEditingTitle(true);
  };

  const saveTitle = () => {
    if (editTitle.trim() && currentSession) {
      onUpdateSession({ name: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const cancelEditing = () => {
    setIsEditingTitle(false);
    setEditTitle('');
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">AI Playground</span>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="h-8 w-48"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTitle();
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  autoFocus
                />
                <Button size="sm" variant="ghost" onClick={saveTitle}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {currentSession?.name || 'No Session'}
                </span>
                {currentSession && (
                  <Button size="sm" variant="ghost" onClick={startEditing}>
                    <Edit3 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onOpenSessionManager}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Sessions
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {user?.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};