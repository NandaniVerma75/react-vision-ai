import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComponentPreviewProps {
  jsx?: string;
  css?: string;
}

export const ComponentPreview = ({ jsx, css }: ComponentPreviewProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Create a safe component renderer
  const renderComponent = useMemo(() => {
    if (!jsx) return null;

    try {
      // This is a simplified implementation
      // In a real app, you'd use a more sophisticated sandboxing solution
      setError(null);
      return (
        <div className="p-8">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Component preview would render here
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Live rendering coming soon...
              </p>
            </div>
          </div>
        </div>
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, [jsx]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError(null);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  if (error) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <Card className="p-6 border-destructive/50 bg-destructive/5 text-center max-w-md">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Render Error</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!jsx) {
    return (
      <div className="h-full p-6 flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center shadow-glow">
            <Eye className="h-10 w-10 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Component Yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Start chatting to generate your first React component. 
            The live preview will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Live Preview</span>
          </div>
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={cn(
              "h-4 w-4",
              isRefreshing && "animate-spin"
            )} />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-background relative">
        {/* Inject custom CSS if provided */}
        {css && (
          <style dangerouslySetInnerHTML={{ __html: css }} />
        )}
        
        {/* Component Content */}
        <div className="h-full overflow-auto">
          {renderComponent}
        </div>

        {/* Grid overlay for design reference */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
    </div>
  );
};