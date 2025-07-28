import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FolderOpen, 
  Calendar, 
  ArrowLeft, 
  Search, 
  Code, 
  Palette 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Session {
  id: string;
  name: string;
  description?: string;
  generated_jsx?: string;
  generated_css?: string;
  created_at: string;
  updated_at: string;
}

interface SessionManagerProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onCreateSession: (name: string, description?: string) => void;
  onClose: () => void;
}

export const SessionManager = ({ 
  sessions, 
  onSelectSession, 
  onCreateSession, 
  onClose 
}: SessionManagerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionDescription, setNewSessionDescription] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSession = () => {
    if (!newSessionName.trim()) return;
    
    onCreateSession(newSessionName.trim(), newSessionDescription.trim() || undefined);
    setNewSessionName('');
    setNewSessionDescription('');
    setIsCreating(false);
  };

  return (
    <div className="h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Playground
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold">Session Manager</h1>
              <p className="text-muted-foreground">
                Manage your playground sessions and generated components
              </p>
            </div>
          </div>

          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="session-name">Session Name</Label>
                  <Input
                    id="session-name"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="My Awesome Component"
                  />
                </div>
                <div>
                  <Label htmlFor="session-description">Description (Optional)</Label>
                  <Textarea
                    id="session-description"
                    value={newSessionDescription}
                    onChange={(e) => setNewSessionDescription(e.target.value)}
                    placeholder="Brief description of what you want to build..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSession} disabled={!newSessionName.trim()}>
                    Create Session
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="flex-1">
          {filteredSessions.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  {sessions.length === 0 ? 'No Sessions Yet' : 'No Matching Sessions'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {sessions.length === 0 
                    ? 'Create your first session to start building components'
                    : 'Try adjusting your search query'
                  }
                </p>
                {sessions.length === 0 && (
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Session
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                {filteredSessions.map((session) => (
                  <Card 
                    key={session.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                    onClick={() => onSelectSession(session)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">
                            {session.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(session.updated_at), { 
                              addSuffix: true 
                            })}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {session.generated_jsx && (
                            <Badge variant="secondary" className="text-xs">
                              <Code className="h-3 w-3 mr-1" />
                              JSX
                            </Badge>
                          )}
                          {session.generated_css && (
                            <Badge variant="secondary" className="text-xs">
                              <Palette className="h-3 w-3 mr-1" />
                              CSS
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {session.description && (
                      <CardContent>
                        <CardDescription className="line-clamp-2">
                          {session.description}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};