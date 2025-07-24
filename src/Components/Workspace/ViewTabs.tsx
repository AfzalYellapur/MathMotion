import React from 'react';
import type { ViewType } from './types';

interface ViewTabsProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewTabs({ currentView, onViewChange }: ViewTabsProps) {
  return (
    <div className="flex gap-x-2 mb-2">
      <button 
        className={`p-[4px] ${currentView === "editor" ? 'bg-red-600' : 'bg-red-300'} text-white rounded-[4px]`}
        onClick={() => onViewChange('editor')}
      >
        Editor
      </button>
      <button 
        className={`p-[4px] ${currentView === "video" ? 'bg-blue-600' : 'bg-blue-300'} text-white rounded-[4px]`} 
        onClick={() => onViewChange('video')}
      >
        Preview
      </button>
    </div>
  );
}