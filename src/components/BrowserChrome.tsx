import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Home, 
  Shield, 
  Star, 
  MoreHorizontal,
  Plus,
  X,
  Search,
  Mic,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
}

interface BrowserChromeProps {
  onNewTab: () => void;
  onNavigate: (url: string) => void;
  currentUrl: string;
  tabs: Tab[];
  onTabClose: (tabId: string) => void;
  onTabSwitch: (tabId: string) => void;
  onSettingsClick: () => void;
}

export function BrowserChrome({ 
  onNewTab, 
  onNavigate, 
  currentUrl, 
  tabs, 
  onTabClose, 
  onTabSwitch,
  onSettingsClick 
}: BrowserChromeProps) {
  const [addressBarValue, setAddressBarValue] = useState(currentUrl);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(addressBarValue);
  };

  const handleVoiceSearch = () => {
    setIsVoiceSearchActive(!isVoiceSearchActive);
    // Voice search implementation would go here
  };

  return (
    <div className="bg-background border-b border-border">
      {/* Tab Bar */}
      <div className="flex items-center px-2 pt-2">
        <div className="flex items-center space-x-1 flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-t-lg cursor-pointer
                min-w-[200px] max-w-[250px] group relative
                ${tab.isActive 
                  ? 'bg-card text-foreground border-b-2 border-primary' 
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }
              `}
              onClick={() => onTabSwitch(tab.id)}
            >
              {tab.favicon ? (
                <img src={tab.favicon} alt="" className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4 bg-primary/20 rounded-sm" />
              )}
              <span className="truncate text-sm font-medium">{tab.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewTab}
          className="ml-2 w-8 h-8 p-0 hover:bg-primary/20"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center space-x-2 p-3">
        {/* Navigation Controls */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Home className="w-4 h-4" />
          </Button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleAddressSubmit} className="flex-1 relative">
          <div className="relative flex items-center">
            <Shield className="absolute left-3 w-4 h-4 text-green-500" />
            <Input
              value={addressBarValue}
              onChange={(e) => setAddressBarValue(e.target.value)}
              placeholder="Search with Casteliea or enter address"
              className="pl-10 pr-20 h-10 bg-muted/50 border-border focus:bg-card"
            />
            <div className="absolute right-2 flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`w-6 h-6 p-0 ${isVoiceSearchActive ? 'text-primary' : ''}`}
                onClick={handleVoiceSearch}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <Star className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-8 h-8 p-0"
            onClick={onSettingsClick}
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}