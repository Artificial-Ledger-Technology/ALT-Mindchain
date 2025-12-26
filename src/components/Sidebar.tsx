"use client";

import React from "react";
import {
    ChevronDown,
    Hash,
    FileText,
    Layers,
    Plus,
    Search,
    Settings,
    User,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";

interface SidebarProps {
    activeView: 'pages' | 'issues';
    onViewChange: (view: 'pages' | 'issues') => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <aside
            className={`flex flex-col border-r border-border bg-background transition-all duration-300 ${isCollapsed ? 'w-[60px]' : 'w-[260px]'}`}
        >
            {/* Workspace Switcher */}
            <div className="p-4 flex items-center justify-between">
                {!isCollapsed && (
                    <div className="flex items-center gap-2 font-semibold text-sm">
                        <div className="w-6 h-6 bg-accent text-background flex items-center justify-center rounded text-xs">M</div>
                        <span>Mindchain</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="btn-ghost"
                >
                    {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </button>
            </div>

            {/* Primary Navigation */}
            <div className="flex-1 overflow-y-auto px-2 space-y-4">
                <div>
                    <div className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {!isCollapsed ? 'Workspace' : '...'}
                    </div>
                    <div className="space-y-0.5">
                        <div
                            className={`sidebar-item ${activeView === 'pages' ? 'sidebar-item-active' : ''}`}
                            onClick={() => onViewChange('pages')}
                        >
                            <FileText className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span>Pages</span>}
                        </div>
                        <div
                            className={`sidebar-item ${activeView === 'issues' ? 'sidebar-item-active' : ''}`}
                            onClick={() => onViewChange('issues')}
                        >
                            <Layers className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span>Issues</span>}
                        </div>
                    </div>
                </div>

                <div>
                    {!isCollapsed && (
                        <div className="flex items-center justify-between px-2 py-2">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pages</span>
                            <Plus className="w-3 h-3 text-muted-foreground hover:text-accent cursor-pointer" />
                        </div>
                    )}
                    <div className="space-y-0.5">
                        <div className="sidebar-item ml-1">
                            <ChevronDown className="w-3 h-3 shrink-0" />
                            {!isCollapsed && <span>Engineering Docs</span>}
                        </div>
                        {!isCollapsed && (
                            <div className="ml-6 space-y-0.5">
                                <div className="sidebar-item">Roadmap 2024</div>
                                <div className="sidebar-item">API Architecture</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User / Settings */}
            <div className="p-4 border-t border-border mt-auto">
                <div className="sidebar-item">
                    <Settings className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Settings</span>}
                </div>
                <div className="sidebar-item mt-1">
                    <User className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Rinoah</span>}
                </div>
            </div>
        </aside>
    );
}
