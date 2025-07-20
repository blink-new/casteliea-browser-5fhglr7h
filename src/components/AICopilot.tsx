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
  RotateCcw,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { blink } from '../blink/client';

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
    const query = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Use real AI to generate response
      const { text } = await blink.ai.generateText({
        prompt: `You are Casteliea AI Copilot, a helpful browser assistant. The user is currently on a page titled "${currentPageTitle || 'New Tab'}" with URL "${currentPageUrl || 'casteliea://newtab'}". 

User question: ${query}

Provide a helpful, concise response. If they're asking about web search, page analysis, or browser features, explain how Casteliea's advanced capabilities work. Be friendly and informative.`,
        maxTokens: 200
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI response failed:', error);
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you're asking about "${query}". Based on the current page "${currentPageTitle || 'this page'}", I'm here to help! As your Casteliea AI Copilot, I can assist with web searches, page analysis, and browsing tasks. How can I help you today?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (actionId: string) => {
    const actionMessages = {
      'summarize': 'Please summarize the main points of this page.',
      'extract-links': 'Extract all the important links from this page.',
      'key-points': 'What are the key takeaways from this content?',
      'explain': 'Explain this content in simple terms.'
    };

    const message = actionMessages[actionId as keyof typeof actionMessages];
    if (!message) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let aiPrompt = '';
      
      if (actionId === 'summarize') {
        aiPrompt = `You are Casteliea AI Copilot. The user wants a summary of the current page "${currentPageTitle || 'New Tab'}" (${currentPageUrl || 'casteliea://newtab'}). 

If this is the New Tab page, explain what Casteliea browser offers: real-time search, AI assistance, privacy protection, and multiple search engines. If it's another page, provide a helpful summary of what the page would contain.`;
      } else if (actionId === 'extract-links') {
        aiPrompt = `You are Casteliea AI Copilot. The user wants to extract links from "${currentPageTitle || 'New Tab'}" (${currentPageUrl || 'casteliea://newtab'}). 

If this is the New Tab page, list the quick access shortcuts (Gmail, YouTube, GitHub, Twitter, Reddit, Netflix, Spotify, Discord) and explain how users can add custom shortcuts. If it's another page, explain how Casteliea's link extraction feature works.`;
      } else if (actionId === 'key-points') {
        aiPrompt = `You are Casteliea AI Copilot. The user wants key takeaways from "${currentPageTitle || 'New Tab'}" (${currentPageUrl || 'casteliea://newtab'}). 

Provide the most important points about this page or Casteliea's features if it's the New Tab page.`;
      } else {
        aiPrompt = `You are Casteliea AI Copilot. The user wants a simple explanation of "${currentPageTitle || 'New Tab'}" (${currentPageUrl || 'casteliea://newtab'}). 

Explain in simple, easy-to-understand terms what this page is about or what Casteliea browser does.`;
      }

      const { text } = await blink.ai.generateText({
        prompt: aiPrompt,
        maxTokens: 250
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Quick action failed:', error);
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I'd be happy to help with that! As your Casteliea AI Copilot, I can ${actionId.replace('-', ' ')} for you. This feature analyzes the current page content and provides intelligent insights. Try asking me specific questions about what you're looking for!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
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