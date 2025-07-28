import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ComponentPreview } from '@/components/ComponentPreview';
import { CodeTabs } from '@/components/CodeTabs';
import { PlaygroundHeader } from '@/components/PlaygroundHeader';
import { SessionManager } from '@/components/SessionManager';
import { supabase } from '@/integrations/supabase/client';

interface Session {
  id: string;
  name: string;
  description?: string;
  generated_jsx?: string;
  generated_css?: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image_url?: string;
  created_at: string;
}

export const Playground = () => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(false);

  // Load sessions on mount
  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSession) {
      loadMessages();
    }
  }, [currentSession]);

  const loadSessions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading sessions:', error);
      return;
    }

    setSessions(data || []);
    
    // If no current session and we have sessions, select the first one
    if (!currentSession && data && data.length > 0) {
      setCurrentSession(data[0]);
    }
  };

  const loadMessages = async () => {
    if (!currentSession) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', currentSession.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages((data || []) as Message[]);
  };

  const createNewSession = async (name: string, description?: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          user_id: user.id,
          name,
          description,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return;
    }

    setSessions(prev => [data, ...prev]);
    setCurrentSession(data);
    setMessages([]);
    setShowSessionManager(false);
  };

  const updateSession = async (updates: Partial<Session>) => {
    if (!currentSession) return;

    const { error } = await supabase
      .from('sessions')
      .update(updates)
      .eq('id', currentSession.id);

    if (error) {
      console.error('Error updating session:', error);
      return;
    }

    setCurrentSession(prev => prev ? { ...prev, ...updates } : null);
    setSessions(prev => prev.map(s => s.id === currentSession.id ? { ...s, ...updates } : s));
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string, imageUrl?: string) => {
    if (!currentSession) return;

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          session_id: currentSession.id,
          role,
          content,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      return;
    }

    setMessages(prev => [...prev, data as Message]);
  };

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!currentSession) return;

    setIsLoading(true);
    
    // Save user message
    await saveMessage('user', content, imageUrl);
    
    // Simulate AI response for now (replace with actual AI integration later)
    setTimeout(async () => {
      const mockResponse = `I'll help you create a React component. Here's a simple example:

\`\`\`jsx
const Button = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button 
      className={\`px-4 py-2 rounded transition-all \${
        variant === 'primary' 
          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      }\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
\`\`\`

\`\`\`css
.button {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
\`\`\``;

      await saveMessage('assistant', mockResponse);
      
      // Extract and update generated code
      const jsxMatch = mockResponse.match(/```jsx\n([\s\S]*?)\n```/);
      const cssMatch = mockResponse.match(/```css\n([\s\S]*?)\n```/);
      
      if (jsxMatch || cssMatch) {
        await updateSession({
          generated_jsx: jsxMatch?.[1] || currentSession.generated_jsx,
          generated_css: cssMatch?.[1] || currentSession.generated_css,
        });
      }
      
      setIsLoading(false);
    }, 2000);
  };

  if (showSessionManager) {
    return (
      <SessionManager
        sessions={sessions}
        onSelectSession={(session) => {
          setCurrentSession(session);
          setShowSessionManager(false);
        }}
        onCreateSession={createNewSession}
        onClose={() => setShowSessionManager(false)}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <PlaygroundHeader
        currentSession={currentSession}
        onOpenSessionManager={() => setShowSessionManager(true)}
        onUpdateSession={updateSession}
      />
      
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <ChatSidebar
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={75}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={30}>
                <ComponentPreview 
                  jsx={currentSession?.generated_jsx}
                  css={currentSession?.generated_css}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={30} minSize={20}>
                <CodeTabs
                  jsx={currentSession?.generated_jsx || ''}
                  css={currentSession?.generated_css || ''}
                  onCodeChange={(type, code) => {
                    updateSession({
                      [type === 'jsx' ? 'generated_jsx' : 'generated_css']: code
                    });
                  }}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};