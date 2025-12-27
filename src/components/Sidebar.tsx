"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronDown,
    FileText,
    Layers,
    Plus,
    Settings,
    User,
    PanelLeftClose,
    PanelLeftOpen,
    File,
    Menu,
    X
} from "lucide-react";

interface SidebarProps {
    activeView: 'pages' | 'issues';
    onViewChange: (view: 'pages' | 'issues') => void;
    pages?: any[];
    onPageSelect?: (id: string) => void;
    onCreatePage?: () => void;
    onCreateIssue?: () => void;
    selectedPageId?: string | null;
}

export default function Sidebar({
    activeView,
    onViewChange,
    pages = [],
    onPageSelect,
    onCreatePage,
    onCreateIssue,
    selectedPageId
}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Auto-collapse on medium screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const SidebarContent = (
        <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between">
                {(!isCollapsed || isMobileOpen) && (
                    <div className="flex items-center gap-2 font-semibold text-sm cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-6 h-6 bg-accent text-background flex items-center justify-center rounded text-xs">M</div>
                        <span>Mindchain</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                )}
                <button
                    onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
                    className="btn-ghost"
                >
                    {isMobileOpen ? <X className="w-4 h-4" /> : isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 space-y-4">
                <div>
                    <div className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {(!isCollapsed || isMobileOpen) ? 'Workspace' : '...'}
                    </div>
                    <div className="space-y-0.5">
                        <button
                            className={`sidebar-item w-full ${activeView === 'pages' ? 'sidebar-item-active' : ''}`}
                            onClick={() => {
                                onViewChange('pages');
                                if (isMobileOpen) setIsMobileOpen(false);
                            }}
                        >
                            <FileText className="w-4 h-4 shrink-0" />
                            {(!isCollapsed || isMobileOpen) && <span>Knowledge Base</span>}
                        </button>
                        <div className="relative group/nav">
                            <button
                                className={`sidebar-item w-full ${activeView === 'issues' ? 'sidebar-item-active' : ''}`}
                                onClick={() => {
                                    onViewChange('issues');
                                    if (isMobileOpen) setIsMobileOpen(false);
                                }}
                            >
                                <Layers className="w-4 h-4 shrink-0" />
                                {(!isCollapsed || isMobileOpen) && <span>Issue Tracker</span>}
                            </button>
                            {(!isCollapsed || isMobileOpen) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewChange('issues');
                                        onCreateIssue?.();
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded text-muted-foreground hover:text-accent opacity-0 group-hover/nav:opacity-100 transition-opacity"
                                    title="Create Issue"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    {(!isCollapsed || isMobileOpen) && (
                        <div className="flex items-center justify-between px-2 py-2 border-t border-border/50 pt-4 mt-2">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Pages</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCreatePage?.();
                                }}
                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-accent"
                                title="Create Page"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    <div className="space-y-0.5">
                        {pages.map((page) => (
                            <button
                                key={page.id}
                                className={`sidebar-item w-full ${selectedPageId === page.id ? 'sidebar-item-active' : ''}`}
                                onClick={() => {
                                    onViewChange('pages');
                                    onPageSelect?.(page.id);
                                    if (isMobileOpen) setIsMobileOpen(false);
                                }}
                            >
                                <File className="w-4 h-4 shrink-0" />
                                {(!isCollapsed || isMobileOpen) && <span className="truncate">{page.title}</span>}
                            </button>
                        ))}
                        {(!isCollapsed || isMobileOpen) && pages.length === 0 && (
                            <p className="px-2 py-1 text-[10px] text-muted-foreground italic">No pages found</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-border mt-auto">
                <div className="sidebar-item">
                    <Settings className="w-4 h-4 shrink-0" />
                    {(!isCollapsed || isMobileOpen) && <span>Settings</span>}
                </div>
                <div className="sidebar-item mt-1">
                    <User className="w-4 h-4 shrink-0" />
                    {(!isCollapsed || isMobileOpen) && <span className="text-glow">Jay Arre</span>}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleMobile}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            >
                {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`flex flex-col border-r border-border bg-background transition-all duration-300 shadow-2xl lg:shadow-none z-40 
                ${isMobileOpen ? 'fixed inset-y-0 left-0 w-[260px]' : isCollapsed ? 'w-0 lg:w-[60px] opacity-0 lg:opacity-100' : 'fixed lg:relative inset-y-0 left-0 lg:left-auto -translate-x-full lg:translate-x-0 w-[260px] lg:w-[260px]'}
                ${isCollapsed ? 'pointer-events-none lg:pointer-events-auto' : ''}`}
            >
                {SidebarContent}
            </aside>
        </>
    );
}
