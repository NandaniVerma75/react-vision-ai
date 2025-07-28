import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, MessageSquare, Eye, Code, Download, Zap, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-dark opacity-50" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold gradient-primary bg-clip-text text-transparent">
              AI Playground
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Build, iterate, and export React components with AI. A stateful micro-frontend 
            playground where your creativity meets artificial intelligence.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Link to="/auth">
              <Button size="lg" className="shadow-glow">
                <Zap className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Eye className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Components Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5k+</div>
              <div className="text-sm text-muted-foreground">AI Iterations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99%</div>
              <div className="text-sm text-muted-foreground">Export Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From conversation to code to production-ready components. 
              Experience the future of component development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Conversational UI</CardTitle>
                <CardDescription>
                  Chat with AI to describe your component. Support for text and image inputs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <Eye className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See your component render in real-time as you iterate and refine.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <Code className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Code Inspection</CardTitle>
                <CardDescription>
                  View and edit both JSX/TSX and CSS with syntax highlighting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <Download className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Easy Export</CardTitle>
                <CardDescription>
                  Download your components as a complete package with copy functionality.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Session Management</CardTitle>
                <CardDescription>
                  Save, organize, and resume your work across multiple sessions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <Star className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Iterative Refinement</CardTitle>
                <CardDescription>
                  Continuously improve your components with follow-up prompts.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 gradient-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From idea to implementation in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Describe</h3>
              <p className="text-muted-foreground">
                Tell the AI what component you want to build using natural language
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate</h3>
              <p className="text-muted-foreground">
                Watch as AI creates React components with JSX and CSS in real-time
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Export</h3>
              <p className="text-muted-foreground">
                Download your production-ready components or copy the code directly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-muted-foreground mb-8">
            Join the future of component development. Start creating with AI today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="shadow-glow">
              <Sparkles className="h-5 w-5 mr-2" />
              Start Building Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;