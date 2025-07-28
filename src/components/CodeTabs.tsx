import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Copy, Download, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

interface CodeTabsProps {
  jsx: string;
  css: string;
  onCodeChange: (type: 'jsx' | 'css', code: string) => void;
}

export const CodeTabs = ({ jsx, css, onCodeChange }: CodeTabsProps) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTab, setEditingTab] = useState<'jsx' | 'css'>('jsx');

  const copyToClipboard = async (content: string, tabName: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTab(tabName);
      toast.success(`${tabName.toUpperCase()} copied to clipboard!`);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadCode = async () => {
    if (!jsx && !css) {
      toast.error('No code to download');
      return;
    }

    try {
      const zip = new JSZip();
      
      if (jsx) {
        // Clean up the JSX for a proper React component file
        const componentCode = jsx.includes('export default') 
          ? jsx 
          : `${jsx}\n\nexport default Component;`;
        
        zip.file('Component.tsx', componentCode);
      }
      
      if (css) {
        zip.file('Component.css', css);
      }
      
      // Add a README
      zip.file('README.md', `# Generated Component

This component was generated using AI Playground.

## Usage

\`\`\`jsx
import Component from './Component';
import './Component.css';

function App() {
  return <Component />;
}
\`\`\`
`);

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'component.zip');
      toast.success('Component downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download code');
    }
  };

  const startEditing = (tab: 'jsx' | 'css') => {
    setEditingTab(tab);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setIsEditing(false);
    toast.success('Code updated!');
  };

  if (!jsx && !css) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg bg-muted/50 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">{'</>'}</span>
          </div>
          <h3 className="font-semibold mb-2">No Code Generated</h3>
          <p className="text-sm text-muted-foreground">
            Generated code will appear here once you create a component
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Generated Code</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={downloadCode}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1">
        <Tabs defaultValue="jsx" className="h-full flex flex-col">
          <TabsList className="m-4 mb-0">
            {jsx && (
              <TabsTrigger value="jsx" className="flex items-center gap-2">
                JSX/TSX
                {jsx && (
                  <Button
                    onClick={() => copyToClipboard(jsx, 'jsx')}
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                  >
                    {copiedTab === 'jsx' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </TabsTrigger>
            )}
            {css && (
              <TabsTrigger value="css" className="flex items-center gap-2">
                CSS
                {css && (
                  <Button
                    onClick={() => copyToClipboard(css, 'css')}
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-1"
                  >
                    {copiedTab === 'css' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          {jsx && (
            <TabsContent value="jsx" className="flex-1 m-4 mt-2">
              <Card className="h-full overflow-hidden">
                {isEditing && editingTab === 'jsx' ? (
                  <div className="h-full flex flex-col">
                    <div className="p-3 border-b border-border/50 flex justify-between items-center">
                      <span className="text-sm font-medium">Edit JSX/TSX</span>
                      <Button onClick={saveEdit} size="sm">
                        Save Changes
                      </Button>
                    </div>
                    <Textarea
                      value={jsx}
                      onChange={(e) => onCodeChange('jsx', e.target.value)}
                      className="flex-1 resize-none border-0 font-mono text-sm"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    />
                  </div>
                ) : (
                  <div className="h-full">
                    <div className="p-3 border-b border-border/50 flex justify-between items-center">
                      <span className="text-sm font-medium">Component Code</span>
                      <Button 
                        onClick={() => startEditing('jsx')} 
                        variant="ghost" 
                        size="sm"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="h-full overflow-auto">
                      <SyntaxHighlighter
                        language="tsx"
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          background: 'transparent',
                          fontSize: '14px',
                          lineHeight: '1.5'
                        }}
                        showLineNumbers
                      >
                        {jsx}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          )}

          {css && (
            <TabsContent value="css" className="flex-1 m-4 mt-2">
              <Card className="h-full overflow-hidden">
                {isEditing && editingTab === 'css' ? (
                  <div className="h-full flex flex-col">
                    <div className="p-3 border-b border-border/50 flex justify-between items-center">
                      <span className="text-sm font-medium">Edit CSS</span>
                      <Button onClick={saveEdit} size="sm">
                        Save Changes
                      </Button>
                    </div>
                    <Textarea
                      value={css}
                      onChange={(e) => onCodeChange('css', e.target.value)}
                      className="flex-1 resize-none border-0 font-mono text-sm"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    />
                  </div>
                ) : (
                  <div className="h-full">
                    <div className="p-3 border-b border-border/50 flex justify-between items-center">
                      <span className="text-sm font-medium">Styles</span>
                      <Button 
                        onClick={() => startEditing('css')} 
                        variant="ghost" 
                        size="sm"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="h-full overflow-auto">
                      <SyntaxHighlighter
                        language="css"
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          background: 'transparent',
                          fontSize: '14px',
                          lineHeight: '1.5'
                        }}
                        showLineNumbers
                      >
                        {css}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};