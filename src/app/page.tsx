"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, Plus, Filter, LayoutGrid, List } from "lucide-react";

export default function DashboardPage() {
    const [activeView, setActiveView] = useState<'pages' | 'issues'>('pages');

    return (
        <main className="flex h-screen bg-background overflow-hidden selection:bg-accent/20">
            <Sidebar activeView={activeView} onViewChange={setActiveView} />

            <section className="flex-1 flex flex-col min-w-0">
                {/* Header / Toolbar */}
                <header className="h-14 border-b border-border flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-medium">
                            {activeView === 'pages' ? 'Knowledge Base' : 'Issue Tracker'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-muted text-xs px-8 py-1.5 rounded outline-none border border-transparent focus:border-border w-48 transition-all"
                            />
                        </div>
                        <button className="bg-foreground text-background text-xs px-3 py-1.5 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" />
                            <span>New</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-[#fafafa] dark:bg-[#09090b]">
                    {activeView === 'pages' ? (
                        <div className="max-w-4xl mx-auto py-12 px-12">
                            <div className="mb-8">
                                <h2 className="text-4xl font-bold tracking-tight mb-2">Engineering Docs</h2>
                                <p className="text-muted-foreground">The central source of truth for our engineering team.</p>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-lg leading-relaxed text-muted-foreground/80">
                                    Welcome to the Mindchain documentation. Here you can find everything from our high-level architectural decisions to specific API implementations.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="p-4 border border-border rounded-lg bg-background hover:border-accent/30 transition-colors cursor-pointer group">
                                        <h4 className="font-semibold mb-1 group-hover:text-accent">Getting Started</h4>
                                        <p className="text-xs text-muted-foreground">Set up your local development environment.</p>
                                    </div>
                                    <div className="p-4 border border-border rounded-lg bg-background hover:border-accent/30 transition-colors cursor-pointer group">
                                        <h4 className="font-semibold mb-1 group-hover:text-accent">Deployment Guide</h4>
                                        <p className="text-xs text-muted-foreground">How we push code to production.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <button className="p-1.5 rounded bg-muted border border-border"><LayoutGrid className="w-4 h-4" /></button>
                                    <button className="p-1.5 rounded hover:bg-muted text-muted-foreground"><List className="w-4 h-4" /></button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="text-xs text-muted-foreground flex items-center gap-1 border border-border px-2 py-1 rounded hover:bg-muted transition-colors">
                                        <Filter className="w-3 h-3" />
                                        Filter
                                    </button>
                                </div>
                            </div>

                            {/* Kanban Board Placeholder */}
                            <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
                                {['Backlog', 'Todo', 'In Progress', 'Done'].map((status) => (
                                    <div key={status} className="w-72 shrink-0 flex flex-col">
                                        <div className="flex items-center justify-between mb-3 px-1">
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{status}</span>
                                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">0</span>
                                        </div>
                                        <div className="flex-1 bg-muted/30 rounded-lg p-2 border border-dashed border-border flex flex-col items-center justify-center gap-2 group cursor-pointer">
                                            <Plus className="w-5 h-5 text-muted-foreground/50 group-hover:text-accent transition-colors" />
                                            <span className="text-xs text-muted-foreground/50 group-hover:text-accent transition-colors italic">Add issue</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
