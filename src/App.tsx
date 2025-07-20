import React, { useState } from 'react';
import { BrowserChrome } from './components/BrowserChrome';
import { NewTabPage } from './components/NewTabPage';
import { AICopilot } from './components/AICopilot';
import { SettingsPage } from './components/SettingsPage';
import { Button } from './components/ui/button';
import { Brain, X } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isActive: boolean;
  content: 'new-tab' | 'settings' | 'webpage';
}

function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'New Tab',
      url: 'casteliea://newtab',
      isActive: true,
      content: 'new-tab'
    }
  ]);

  const [currentUrl, setCurrentUrl] = useState('casteliea://newtab');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const activeTab = tabs.find(tab => tab.isActive);

  const handleNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'casteliea://newtab',
      isActive: true,
      content: 'new-tab'
    };

    setTabs(prevTabs => [
      ...prevTabs.map(tab => ({ ...tab, isActive: false })),
      newTab
    ]);
    setCurrentUrl('casteliea://newtab');
  };

  const handleTabClose = (tabId: string) => {
    setTabs(prevTabs => {
      const updatedTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      // If we closed the active tab, make the last tab active
      if (updatedTabs.length > 0 && !updatedTabs.some(tab => tab.isActive)) {
        updatedTabs[updatedTabs.length - 1].isActive = true;
        setCurrentUrl(updatedTabs[updatedTabs.length - 1].url);
      }
      
      // If no tabs left, create a new one
      if (updatedTabs.length === 0) {
        const newTab: Tab = {
          id: Date.now().toString(),
          title: 'New Tab',
          url: 'casteliea://newtab',
          isActive: true,
          content: 'new-tab'
        };
        return [newTab];
      }
      
      return updatedTabs;
    });
  };

  const handleTabSwitch = (tabId: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId
      }))
    );
    
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setCurrentUrl(tab.url);
    }
  };

  const handleNavigate = (url: string) => {
    setCurrentUrl(url);
    
    // Update the active tab
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.isActive
          ? { 
              ...tab, 
              url, 
              title: url === 'casteliea://newtab' ? 'New Tab' : 
                     url === 'casteliea://settings' ? 'Settings' : 
                     new URL(url).hostname,
              content: url === 'casteliea://newtab' ? 'new-tab' :
                      url === 'casteliea://settings' ? 'settings' : 'webpage'
            }
          : tab
      )
    );
  };

  const handleSettingsClick = () => {
    handleNavigate('casteliea://settings');
  };

  const renderTabContent = () => {
    if (!activeTab) return null;

    switch (activeTab.content) {
      case 'new-tab':
        return <NewTabPage />;
      case 'settings':
        return <SettingsPage />;
      case 'webpage':
        return (
          <div className="flex-1 bg-card p-8 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Webpage Simulation</h2>
              <p className="text-muted-foreground max-w-md">
                In the full Casteliea browser, this would display the actual webpage content. 
                The AI Copilot would analyze the page and provide contextual assistance.
              </p>
              <p className="text-sm text-accent">
                Current URL: {activeTab.url}
              </p>
            </div>
          </div>
        );
      default:
        return <NewTabPage />;
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Browser Chrome */}
      <BrowserChrome
        onNewTab={handleNewTab}
        onNavigate={handleNavigate}
        currentUrl={currentUrl}
        tabs={tabs}
        onTabClose={handleTabClose}
        onTabSwitch={handleTabSwitch}
        onSettingsClick={handleSettingsClick}
      />

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {renderTabContent()}
        
        {/* AI Copilot Toggle Button */}
        {!isCopilotOpen && (
          <Button
            onClick={() => setIsCopilotOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform z-40 float"
            size="lg"
          >
            <Brain className="w-6 h-6" />
          </Button>
        )}

        {/* AI Copilot */}
        <AICopilot
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          currentPageUrl={activeTab?.url}
          currentPageTitle={activeTab?.title}
        />
      </div>

      {/* Welcome Message */}
      {tabs.length === 1 && activeTab?.content === 'new-tab' && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="text-center space-y-4 opacity-20">
            <div className="text-8xl font-bold casteliea-gradient">
              Casteliea
            </div>
            <p className="text-xl text-muted-foreground">
              The Future of Browsing
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;