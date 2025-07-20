import React, { useState } from 'react';
import { 
  Search, 
  Shield, 
  Brain, 
  Palette, 
  Globe, 
  Lock, 
  Eye, 
  Zap,
  Download,
  Trash2,
  Plus,
  Edit,
  Check,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SearchEngine {
  id: string;
  name: string;
  shortcut: string;
  url: string;
  isDefault: boolean;
  isCustom: boolean;
}

export function SettingsPage() {
  const [searchEngines, setSearchEngines] = useState<SearchEngine[]>([
    { id: '1', name: 'Google', shortcut: 'g', url: 'https://google.com/search?q=%s', isDefault: true, isCustom: false },
    { id: '2', name: 'DuckDuckGo', shortcut: 'ddg', url: 'https://duckduckgo.com/?q=%s', isDefault: false, isCustom: false },
    { id: '3', name: 'Bing', shortcut: 'b', url: 'https://bing.com/search?q=%s', isDefault: false, isCustom: false },
    { id: '4', name: 'Kagi', shortcut: 'kagi', url: 'https://kagi.com/search?q=%s', isDefault: false, isCustom: false },
    { id: '5', name: 'Brave Search', shortcut: 'brave', url: 'https://search.brave.com/search?q=%s', isDefault: false, isCustom: false },
    { id: '6', name: 'Startpage', shortcut: 'sp', url: 'https://startpage.com/search?q=%s', isDefault: false, isCustom: false },
    { id: '7', name: 'Ecosia', shortcut: 'eco', url: 'https://ecosia.org/search?q=%s', isDefault: false, isCustom: false },
    { id: '8', name: 'You.com', shortcut: 'you', url: 'https://you.com/search?q=%s', isDefault: false, isCustom: false },
  ]);

  const [privacySettings, setPrivacySettings] = useState({
    blockTrackers: true,
    blockAds: true,
    blockCookies: false,
    forceHttps: true,
    fingerprintProtection: true,
    incognitoPlusMode: false,
    clearDataOnExit: false,
  });

  const [aiSettings, setAiSettings] = useState({
    enableCopilot: true,
    autoSummarize: false,
    voiceCommands: true,
    contextAwareness: true,
    smartSuggestions: true,
  });

  const [newEngine, setNewEngine] = useState({ name: '', shortcut: '', url: '' });
  const [isAddingEngine, setIsAddingEngine] = useState(false);

  const handleAddEngine = () => {
    if (newEngine.name && newEngine.shortcut && newEngine.url) {
      const engine: SearchEngine = {
        id: Date.now().toString(),
        name: newEngine.name,
        shortcut: newEngine.shortcut,
        url: newEngine.url,
        isDefault: false,
        isCustom: true,
      };
      setSearchEngines([...searchEngines, engine]);
      setNewEngine({ name: '', shortcut: '', url: '' });
      setIsAddingEngine(false);
    }
  };

  const handleSetDefault = (engineId: string) => {
    setSearchEngines(engines =>
      engines.map(engine => ({
        ...engine,
        isDefault: engine.id === engineId,
      }))
    );
  };

  const handleDeleteEngine = (engineId: string) => {
    setSearchEngines(engines => engines.filter(engine => engine.id !== engineId));
  };

  const updatePrivacySetting = (key: keyof typeof privacySettings, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const updateAISetting = (key: keyof typeof aiSettings, value: boolean) => {
    setAiSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold casteliea-gradient mb-2">Casteliea Settings</h1>
          <p className="text-muted-foreground">Customize your browsing experience</p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>AI Copilot</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Search Settings */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Search Engines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {searchEngines.map((engine) => (
                    <div key={engine.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{engine.name}</span>
                        </div>
                        <span className="text-sm bg-muted px-2 py-1 rounded">
                          {engine.shortcut}
                        </span>
                        {engine.isDefault && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {!engine.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(engine.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        {engine.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEngine(engine.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Engine */}
                {isAddingEngine ? (
                  <div className="p-4 border border-border rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="engine-name">Name</Label>
                        <Input
                          id="engine-name"
                          value={newEngine.name}
                          onChange={(e) => setNewEngine(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Search Engine Name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="engine-shortcut">Shortcut</Label>
                        <Input
                          id="engine-shortcut"
                          value={newEngine.shortcut}
                          onChange={(e) => setNewEngine(prev => ({ ...prev, shortcut: e.target.value }))}
                          placeholder="shortcut"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="engine-url">Search URL</Label>
                      <Input
                        id="engine-url"
                        value={newEngine.url}
                        onChange={(e) => setNewEngine(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/search?q=%s"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddEngine} size="sm">
                        <Check className="w-4 h-4 mr-2" />
                        Add Engine
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingEngine(false)}
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingEngine(true)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Search Engine
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy Protection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="block-trackers" className="text-base font-medium">Block Trackers</Label>
                      <p className="text-sm text-muted-foreground">Prevent websites from tracking your activity</p>
                    </div>
                    <Switch
                      id="block-trackers"
                      checked={privacySettings.blockTrackers}
                      onCheckedChange={(checked) => updatePrivacySetting('blockTrackers', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="block-ads" className="text-base font-medium">Block Advertisements</Label>
                      <p className="text-sm text-muted-foreground">Hide ads and improve page loading speed</p>
                    </div>
                    <Switch
                      id="block-ads"
                      checked={privacySettings.blockAds}
                      onCheckedChange={(checked) => updatePrivacySetting('blockAds', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="force-https" className="text-base font-medium">Force HTTPS</Label>
                      <p className="text-sm text-muted-foreground">Always use secure connections when available</p>
                    </div>
                    <Switch
                      id="force-https"
                      checked={privacySettings.forceHttps}
                      onCheckedChange={(checked) => updatePrivacySetting('forceHttps', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="fingerprint-protection" className="text-base font-medium">Fingerprint Protection</Label>
                      <p className="text-sm text-muted-foreground">Prevent browser fingerprinting techniques</p>
                    </div>
                    <Switch
                      id="fingerprint-protection"
                      checked={privacySettings.fingerprintProtection}
                      onCheckedChange={(checked) => updatePrivacySetting('fingerprintProtection', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="incognito-plus" className="text-base font-medium">Incognito++ Mode</Label>
                      <p className="text-sm text-muted-foreground">Enhanced private browsing with memory encryption</p>
                    </div>
                    <Switch
                      id="incognito-plus"
                      checked={privacySettings.incognitoPlusMode}
                      onCheckedChange={(checked) => updatePrivacySetting('incognitoPlusMode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Settings */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Copilot Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-copilot" className="text-base font-medium">Enable AI Copilot</Label>
                      <p className="text-sm text-muted-foreground">Show the floating AI assistant sidebar</p>
                    </div>
                    <Switch
                      id="enable-copilot"
                      checked={aiSettings.enableCopilot}
                      onCheckedChange={(checked) => updateAISetting('enableCopilot', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-summarize" className="text-base font-medium">Auto-Summarize Pages</Label>
                      <p className="text-sm text-muted-foreground">Automatically generate page summaries</p>
                    </div>
                    <Switch
                      id="auto-summarize"
                      checked={aiSettings.autoSummarize}
                      onCheckedChange={(checked) => updateAISetting('autoSummarize', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="voice-commands" className="text-base font-medium">Voice Commands</Label>
                      <p className="text-sm text-muted-foreground">Enable voice interaction with AI</p>
                    </div>
                    <Switch
                      id="voice-commands"
                      checked={aiSettings.voiceCommands}
                      onCheckedChange={(checked) => updateAISetting('voiceCommands', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="context-awareness" className="text-base font-medium">Context Awareness</Label>
                      <p className="text-sm text-muted-foreground">Allow AI to analyze current page content</p>
                    </div>
                    <Switch
                      id="context-awareness"
                      checked={aiSettings.contextAwareness}
                      onCheckedChange={(checked) => updateAISetting('contextAwareness', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smart-suggestions" className="text-base font-medium">Smart Suggestions</Label>
                      <p className="text-sm text-muted-foreground">Get AI-powered search and navigation suggestions</p>
                    </div>
                    <Switch
                      id="smart-suggestions"
                      checked={aiSettings.smartSuggestions}
                      onCheckedChange={(checked) => updateAISetting('smartSuggestions', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Appearance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme" className="text-base font-medium">Theme</Label>
                    <Select defaultValue="dark">
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark (Default)</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="auto">Auto (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="accent-color" className="text-base font-medium">Accent Color</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {['#E53E3E', '#4299E1', '#38A169', '#D69E2E', '#9F7AEA', '#ED64A6'].map((color) => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-lg border-2 border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font-size" className="text-base font-medium">Font Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium (Default)</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extra-large">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}