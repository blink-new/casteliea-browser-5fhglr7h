import React, { useState } from 'react';
import { 
  Brain, 
  Send, 
  Mic, 
  FileText, 
  Link, 
  Sparkles, 
  X,
  Minimize2,
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AICopilotProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageUrl?: string;
  currentPageTitle?: string;
}

export function AICopilot({ isOpen, onClose, currentPageUrl, currentPageTitle }: AICopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your Casteliea AI Copilot. I can help you summarize this page, answer questions, extract links, or assist with research. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quickActions = [
    { id: 'summarize', label: 'Summarize Page', icon: FileText },
    { id: 'extract-links', label: 'Extract Links', icon: Link },
    { id: 'key-points', label: 'Key Points', icon: Sparkles },
    { id: 'explain', label: 'Explain Simply', icon: Brain },
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you're asking about "${inputValue}". Based on the current page "${currentPageTitle || 'this page'}", here's what I can tell you: This is a simulated response. In the full implementation, I would analyze the page content and provide contextual answers.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (actionId: string) => {
    const actionMessages = {
      'summarize': 'Please summarize the main points of this page.',
      'extract-links': 'Extract all the important links from this page.',
      'key-points': 'What are the key takeaways from this content?',
      'explain': 'Explain this content in simple terms.'
    };

    setInputValue(actionMessages[actionId as keyof typeof actionMessages] || '');
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed right-4 top-20 bottom-4 w-96 z-50 transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>
      <Card className="h-full glass border-border/50 shadow-2xl">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-accent" />
              </div>
              <span>AI Copilot</span>
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {!isMinimized && currentPageTitle && (
            <p className="text-sm text-muted-foreground truncate">
              Analyzing: {currentPageTitle}
            </p>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-full pb-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.id)}
                  className="h-auto p-2 flex flex-col items-center space-y-1 text-xs"
                >
                  <action.icon className="w-4 h-4" />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about this page..."
                  className="pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 w-8 h-8 p-0"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>

            {/* Context Info */}
            <div className="mt-2 text-xs text-muted-foreground text-center">
              AI has context of current page content
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}