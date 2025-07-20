import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Clock, 
  Bookmark, 
  TrendingUp, 
  Globe,
  Zap,
  Shield,
  Brain,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { blink } from '../blink/client';

interface Shortcut {
  id: string;
  title: string;
  url: string;
  icon: string;
  color: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  image?: string;
}

export function NewTabPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('google');
  const [isSearching, setIsSearching] = useState(false);
  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [trackerCount, setTrackerCount] = useState(0);

  const shortcuts: Shortcut[] = [
    { id: '1', title: 'Gmail', url: 'https://gmail.com', icon: '📧', color: 'bg-red-500' },
    { id: '2', title: 'YouTube', url: 'https://youtube.com', icon: '📺', color: 'bg-red-600' },
    { id: '3', title: 'GitHub', url: 'https://github.com', icon: '🐙', color: 'bg-gray-800' },
    { id: '4', title: 'Twitter', url: 'https://twitter.com', icon: '🐦', color: 'bg-blue-500' },
    { id: '5', title: 'Reddit', url: 'https://reddit.com', icon: '🤖', color: 'bg-orange-500' },
    { id: '6', title: 'Netflix', url: 'https://netflix.com', icon: '🎬', color: 'bg-red-700' },
    { id: '7', title: 'Spotify', url: 'https://spotify.com', icon: '🎵', color: 'bg-green-500' },
    { id: '8', title: 'Discord', url: 'https://discord.com', icon: '💬', color: 'bg-indigo-500' },
  ];

  const topStories: NewsItem[] = [
    {
      id: '1',
      title: 'AI Breakthrough: New Language Model Achieves Human-Level Reasoning',
      source: 'TechCrunch',
      time: '2 hours ago',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Climate Summit Reaches Historic Agreement on Carbon Reduction',
      source: 'BBC News',
      time: '4 hours ago',
      category: 'Environment'
    },
    {
      id: '3',
      title: 'Space Mission Successfully Lands on Mars, Discovers Water Evidence',
      source: 'NASA',
      time: '6 hours ago',
      category: 'Science'
    },
    {
      id: '4',
      title: 'Quantum Computing Milestone: 1000-Qubit Processor Unveiled',
      source: 'Nature',
      time: '8 hours ago',
      category: 'Technology'
    }
  ];

  const searchEngines = [
    { id: 'google', name: 'Google', shortcut: 'g' },
    { id: 'duckduckgo', name: 'DuckDuckGo', shortcut: 'ddg' },
    { id: 'bing', name: 'Bing', shortcut: 'b' },
    { id: 'kagi', name: 'Kagi', shortcut: 'kagi' },
    { id: 'brave', name: 'Brave Search', shortcut: 'brave' },
  ];

  // Load live news on component mount
  useEffect(() => {
    const fallbackStories: NewsItem[] = [
      {
        id: '1',
        title: 'AI Breakthrough: New Language Model Achieves Human-Level Reasoning',
        source: 'TechCrunch',
        time: '2 hours ago',
        category: 'Technology'
      },
      {
        id: '2',
        title: 'Climate Summit Reaches Historic Agreement on Carbon Reduction',
        source: 'BBC News',
        time: '4 hours ago',
        category: 'Environment'
      },
      {
        id: '3',
        title: 'Space Mission Successfully Lands on Mars, Discovers Water Evidence',
        source: 'NASA',
        time: '6 hours ago',
        category: 'Science'
      },
      {
        id: '4',
        title: 'Quantum Computing Milestone: 1000-Qubit Processor Unveiled',
        source: 'Nature',
        time: '8 hours ago',
        category: 'Technology'
      }
    ];

    const loadLiveNews = async () => {
      try {
        setIsLoadingNews(true);
        // Use Blink's web search to get real news
        const newsResults = await blink.data.search('latest technology news', {
          type: 'news',
          limit: 6
        });
        
        if (newsResults.news_results) {
          const formattedNews: NewsItem[] = newsResults.news_results.map((article: any, index: number) => ({
            id: index.toString(),
            title: article.title,
            source: article.source || 'News Source',
            time: article.date || 'Recent',
            category: 'Technology',
            image: article.thumbnail
          }));
          setLiveNews(formattedNews);
        }
      } catch (error) {
        console.error('Failed to load news:', error);
        // Fallback to static news if API fails
        setLiveNews(fallbackStories);
      } finally {
        setIsLoadingNews(false);
      }
    };

    loadLiveNews();
    // Simulate tracker blocking count
    const interval = setInterval(() => {
      setTrackerCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Detect search engine shortcuts
      const shortcuts: { [key: string]: string } = {
        'g ': 'google',
        'ddg ': 'duckduckgo',
        'b ': 'bing',
        'kagi ': 'kagi',
        'brave ': 'brave'
      };

      let actualQuery = searchQuery;
      let engineToUse = selectedEngine;

      // Check for shortcuts
      for (const [shortcut, engine] of Object.entries(shortcuts)) {
        if (searchQuery.toLowerCase().startsWith(shortcut)) {
          actualQuery = searchQuery.slice(shortcut.length);
          engineToUse = engine;
          break;
        }
      }

      // If it looks like a URL, navigate directly
      if (actualQuery.includes('.') && !actualQuery.includes(' ')) {
        const url = actualQuery.startsWith('http') ? actualQuery : `https://${actualQuery}`;
        window.open(url, '_blank');
        return;
      }

      // Perform real web search
      const searchResults = await blink.data.search(actualQuery, {
        type: 'web',
        limit: 10
      });

      // Open first result in new tab
      if (searchResults.organic_results && searchResults.organic_results.length > 0) {
        window.open(searchResults.organic_results[0].link, '_blank');
      } else {
        // Fallback to search engine
        const searchUrls: { [key: string]: string } = {
          google: `https://www.google.com/search?q=${encodeURIComponent(actualQuery)}`,
          duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(actualQuery)}`,
          bing: `https://www.bing.com/search?q=${encodeURIComponent(actualQuery)}`,
          kagi: `https://kagi.com/search?q=${encodeURIComponent(actualQuery)}`,
          brave: `https://search.brave.com/search?q=${encodeURIComponent(actualQuery)}`
        };
        window.open(searchUrls[engineToUse] || searchUrls.google, '_blank');
      }
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to direct search engine
      const searchUrls: { [key: string]: string } = {
        google: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`,
        bing: `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
        kagi: `https://kagi.com/search?q=${encodeURIComponent(searchQuery)}`,
        brave: `https://search.brave.com/search?q=${encodeURIComponent(searchQuery)}`
      };
      window.open(searchUrls[selectedEngine] || searchUrls.google, '_blank');
    } finally {
      setIsSearching(false);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Time and Greeting */}
        <div className="text-center mb-12">
          <div className="text-6xl font-bold text-foreground mb-2">
            {getCurrentTime()}
          </div>
          <div className="text-xl text-muted-foreground mb-8">
            {getCurrentDate()}
          </div>
          <h1 className="text-4xl font-bold casteliea-gradient mb-2">
            Welcome to Casteliea
          </h1>
          <p className="text-lg text-muted-foreground">
            The browser that's faster, smarter, safer, and more human
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center glass rounded-2xl p-2">
              <Search className="absolute left-6 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the web or ask Casteliea AI..."
                className="pl-14 pr-20 h-14 text-lg bg-transparent border-none focus:ring-0 focus:outline-none"
                disabled={isSearching}
              />
              <div className="absolute right-2 flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 hover:bg-primary/20"
                >
                  <Mic className="w-5 h-5" />
                </Button>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 hover:bg-accent/20"
                  disabled={isSearching}
                >
                  {isSearching ? <Loader2 className="w-5 h-5 text-accent animate-spin" /> : <Brain className="w-5 h-5 text-accent" />}
                </Button>
              </div>
            </div>
          </form>

          {/* Search Engine Shortcuts */}
          <div className="flex justify-center space-x-4 mt-4">
            {searchEngines.map((engine) => (
              <Button
                key={engine.id}
                variant={selectedEngine === engine.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedEngine(engine.id)}
                className="text-xs"
              >
                {engine.shortcut}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Access Shortcuts */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            Quick Access
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {shortcuts.map((shortcut) => (
              <Card 
                key={shortcut.id} 
                className="group cursor-pointer hover:scale-105 transition-transform glass border-border/50"
                onClick={() => window.open(shortcut.url, '_blank')}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${shortcut.color} rounded-xl flex items-center justify-center text-2xl mb-2 mx-auto group-hover:scale-110 transition-transform`}>
                    {shortcut.icon}
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {shortcut.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Top Stories */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Top Stories
            </h2>
            <div className="space-y-4">
              {isLoadingNews ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="glass border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-muted rounded-full mt-2 flex-shrink-0 animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                          <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                          <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                (liveNews.length > 0 ? liveNews : topStories).map((story) => (
                  <Card key={story.id} className="group cursor-pointer hover:bg-muted/50 transition-colors glass border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {story.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
                            <span>{story.source}</span>
                            <span>•</span>
                            <span>{story.time}</span>
                            <span>•</span>
                            <span className="text-accent">{story.category}</span>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Privacy & Features */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              Privacy & Features
            </h2>
            <div className="space-y-4">
              <Card className="glass border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Trackers Blocked Today</h3>
                      <p className="text-2xl font-bold text-green-500">{trackerCount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">AI Copilot</h3>
                      <p className="text-sm text-muted-foreground">Ready to assist you</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Search Engines</h3>
                      <p className="text-sm text-muted-foreground">10+ engines available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}