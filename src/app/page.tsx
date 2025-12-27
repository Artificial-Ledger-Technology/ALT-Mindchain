"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/editor/Editor";
import LandingPage from "@/components/LandingPage";
import { Search, Plus, Filter, LayoutGrid, List, Loader2, FileText, LogOut, User, Trash2, Edit3, X, ExternalLink, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagesService } from "@/services/pages";
import { issuesService } from "@/services/issues";
import { useRealtime } from "@/hooks/useRealtime";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const queryClient = useQueryClient();
    const [activeView, setActiveView] = useState<'pages' | 'issues'>('pages');
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [creatingInStatus, setCreatingInStatus] = useState<string | null>(null);
    const [newIssueTitle, setNewIssueTitle] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingIssue, setEditingIssue] = useState<any | null>(null);
    const [issueFormData, setIssueFormData] = useState({ title: '', description: '', priority: 'Med', status: 'Backlog' });

    // Mock workspace ID for MVP - in a real app, this would be fetched from the user's workspaces
    const workspaceId = "00000000-0000-0000-0000-000000000000";

    // Fetch Pages
    const { data: pages, isLoading: isLoadingPages } = useQuery({
        queryKey: ['pages', workspaceId],
        queryFn: () => pagesService.getPages(workspaceId),
        enabled: !!user,
    });

    // Fetch Issues
    const { data: issues, isLoading: isLoadingIssues } = useQuery({
        queryKey: ['issues', workspaceId],
        queryFn: () => issuesService.getIssues(workspaceId),
        enabled: !!user,
    });

    // Realtime subscriptions
    useRealtime('pages', ['pages', workspaceId]);
    useRealtime('issues', ['issues', workspaceId]);

    const updatePageMutation = useMutation({
        mutationFn: ({ id, title, content }: { id: string; title?: string; content?: any }) =>
            pagesService.updatePage(id, { title, content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pages', workspaceId] });
        },
    });

    const createPageMutation = useMutation({
        mutationFn: () => pagesService.createPage({
            title: 'New Page',
            content: {},
            workspace_id: workspaceId,
            author_id: user?.id || ''
        }),
        onSuccess: (newPage) => {
            queryClient.invalidateQueries({ queryKey: ['pages', workspaceId] });
            setSelectedPageId(newPage.id);
            setActiveView('pages');
        },
    });

    const updateIssueStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: any }) =>
            issuesService.updateIssueStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues', workspaceId] });
        },
    });

    const createIssueMutation = useMutation({
        mutationFn: (issue: { title: string; description?: string; status?: string; priority?: string }) => issuesService.createIssue({
            title: issue.title,
            description: issue.description,
            status: (issue.status || 'Backlog') as any,
            priority: (issue.priority || 'Med') as any,
            workspace_id: workspaceId,
            author_id: user?.id || ''
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues', workspaceId] });
            setCreatingInStatus(null);
            setNewIssueTitle("");
            setIsCreateModalOpen(false);
            setIssueFormData({ title: '', description: '', priority: 'Med', status: 'Backlog' });
        },
    });

    const updateIssueMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            issuesService.updateIssue(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues', workspaceId] });
            setEditingIssue(null);
        },
    });

    const deleteIssueMutation = useMutation({
        mutationFn: (id: string) => issuesService.deleteIssue(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues', workspaceId] });
        },
    });

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    if (isAuthLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    if (!user) {
        return <LandingPage />;
    }

    const selectedPage = pages?.find(p => p.id === selectedPageId);

    return (
        <main className="flex h-screen bg-background overflow-hidden selection:bg-accent/30">
            <Sidebar
                pages={pages || []}
                onPageSelect={setSelectedPageId}
                selectedPageId={selectedPageId}
                onViewChange={setActiveView}
                activeView={activeView}
                onCreatePage={() => createPageMutation.mutate()}
                onCreateIssue={() => {
                    setActiveView('issues');
                    setCreatingInStatus('Backlog');
                }}
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-[200px] md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-muted/5 border border-border rounded-lg py-1 md:py-1.5 pl-8 md:pl-10 pr-4 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (activeView === 'issues') {
                                    setIssueFormData({ title: '', description: '', priority: 'Med', status: 'Backlog' });
                                    setIsCreateModalOpen(true);
                                } else {
                                    createPageMutation.mutate();
                                }
                            }}
                            className="flex items-center gap-2 bg-foreground text-background px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-bold hover:bg-foreground/90 transition-all active:scale-95"
                        >
                            <Plus className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">New</span>
                        </button>
                        <div className="h-6 w-px bg-border mx-1 md:mx-2" />
                        <div className="flex items-center gap-2 px-2 py-1 bg-muted/20 rounded-full border border-border group relative cursor-default">
                            <User className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                            <span className="text-[10px] md:text-xs font-semibold mr-1 truncate max-w-[50px] md:max-w-none">{user.email?.split('@')[0]}</span>
                            <button
                                onClick={handleSignOut}
                                className="p-1 hover:text-red-500 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-3 w-3.5 h-3 h-3.5" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden relative">
                    {isLoadingPages || isLoadingIssues ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                        </div>
                    ) : null}

                    {activeView === 'pages' ? (
                        <div className="h-full flex flex-col">
                            {selectedPage ? (
                                <>
                                    <div className="px-8 pt-8 pb-4 border-b border-border/50 bg-background/50">
                                        <input
                                            type="text"
                                            value={selectedPage.title}
                                            onChange={(e) => updatePageMutation.mutate({ id: selectedPage.id, title: e.target.value })}
                                            className="text-4xl font-black bg-transparent border-none focus:outline-none w-full tracking-tight text-glow"
                                            placeholder="Page Title"
                                        />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <Editor
                                            content={selectedPage.content}
                                            onChange={(content) => updatePageMutation.mutate({ id: selectedPage.id, content })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
                                    <div className="w-16 h-16 rounded-3xl bg-muted/10 flex items-center justify-center border border-dashed border-border mb-2 animate-pulse">
                                        <FileText className="w-8 h-8 opacity-20" />
                                    </div>
                                    <p className="text-sm font-medium tracking-wide">Select a page or create a new one to begin.</p>
                                    <button
                                        onClick={() => createPageMutation.mutate()}
                                        className="text-accent text-xs font-bold hover:underline underline-offset-4 tracking-widest uppercase"
                                    >
                                        + Create Blank Page
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black tracking-tighter">Issue Tracker</h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded">Realtime Active</span>
                                </div>
                            </div>

                            <div className="flex gap-4 flex-1 h-full min-h-0 overflow-x-auto pb-4 custom-scrollbar">
                                {['Backlog', 'Todo', 'In Progress', 'Done'].map((status) => (
                                    <div key={status} className="w-72 shrink-0 flex flex-col rounded-xl bg-muted/20 p-3 border border-border/50">
                                        <div className="flex items-center justify-between mb-4 px-1">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{status}</span>
                                            <span className="text-[10px] bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground border border-border">
                                                {issues?.filter(i => i.status === status).length || 0}
                                            </span>
                                        </div>
                                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                                            {issues?.filter(i => i.status === status).map((issue: any) => (
                                                <div
                                                    key={issue.id}
                                                    className="bg-background border border-border p-3 rounded-lg shadow-sm hover:border-accent/40 transition-all cursor-grab active:cursor-grabbing group animate-in fade-in zoom-in-95 duration-300 relative"
                                                    draggable
                                                    onDragStart={(e) => e.dataTransfer.setData('issueId', issue.id)}
                                                    onClick={() => setEditingIssue(issue)}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-sm font-medium group-hover:text-accent transition-colors pr-6">{issue.title}</h4>
                                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingIssue(issue);
                                                                }}
                                                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-white"
                                                            >
                                                                <Edit3 className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (confirm('Delete this issue?')) deleteIssueMutation.mutate(issue.id);
                                                                }}
                                                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-red-500"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${issue.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                                                                issue.priority === 'Med' ? 'bg-amber-500/10 text-amber-500' :
                                                                    'bg-blue-500/10 text-blue-500'
                                                                }`}>
                                                                {issue.priority}
                                                            </div>
                                                            {issue.linked_page_id && (
                                                                <div className="flex items-center gap-1 text-[10px] text-accent/80 bg-accent/10 px-1.5 py-0.5 rounded transition-all group-hover:bg-accent/20">
                                                                    <FileText className="w-2.5 h-2.5" />
                                                                    <span>Doc</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">#{issue.id.slice(0, 4)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {creatingInStatus === status ? (
                                                <div className="bg-background border border-accent p-3 rounded-lg shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        placeholder="What needs to be done?"
                                                        value={newIssueTitle}
                                                        onChange={(e) => setNewIssueTitle(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && newIssueTitle.trim()) {
                                                                createIssueMutation.mutate({ title: newIssueTitle, status });
                                                            } else if (e.key === 'Escape') {
                                                                setCreatingInStatus(null);
                                                                setNewIssueTitle("");
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (!newIssueTitle.trim()) {
                                                                setCreatingInStatus(null);
                                                            }
                                                        }}
                                                        className="w-full bg-transparent border-none p-0 text-sm focus:outline-none mb-2"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => newIssueTitle.trim() && createIssueMutation.mutate({ title: newIssueTitle, status })}
                                                            className="text-[10px] bg-accent text-background font-bold px-2 py-1 rounded"
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setCreatingInStatus(null);
                                                                setNewIssueTitle("");
                                                            }}
                                                            className="text-[10px] text-muted-foreground hover:text-white"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="py-6 px-3 rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-muted/30 hover:border-accent/50 transition-all"
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        const id = e.dataTransfer.getData('issueId');
                                                        updateIssueStatusMutation.mutate({ id, status });
                                                    }}
                                                    onClick={() => setCreatingInStatus(status)}
                                                >
                                                    <Plus className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                                                    <span className="text-[10px] font-bold text-muted-foreground group-hover:text-accent tracking-widest uppercase">Add Issue</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Issue Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-background border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-accent" />
                                Create New Issue
                            </h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Title</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={issueFormData.title}
                                    onChange={(e) => setIssueFormData({ ...issueFormData, title: e.target.value })}
                                    className="w-full bg-muted/10 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-accent outline-none"
                                    placeholder="Issue summary..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</label>
                                <textarea
                                    value={issueFormData.description}
                                    onChange={(e) => setIssueFormData({ ...issueFormData, description: e.target.value })}
                                    className="w-full bg-muted/10 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[100px] resize-none"
                                    placeholder="Provide more context..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Priority</label>
                                    <select
                                        value={issueFormData.priority}
                                        onChange={(e) => setIssueFormData({ ...issueFormData, priority: e.target.value })}
                                        className="w-full bg-muted/10 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-accent outline-none appearance-none"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Med">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Initial Status</label>
                                    <select
                                        value={issueFormData.status}
                                        onChange={(e) => setIssueFormData({ ...issueFormData, status: e.target.value })}
                                        className="w-full bg-muted/10 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-accent outline-none appearance-none"
                                    >
                                        <option value="Backlog">Backlog</option>
                                        <option value="Todo">Todo</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-muted/10 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => issueFormData.title.trim() && createIssueMutation.mutate(issueFormData)}
                                disabled={!issueFormData.title.trim() || createIssueMutation.isPending}
                                className="bg-foreground text-background px-6 py-2 rounded-lg text-sm font-black hover:bg-foreground/90 transition-all disabled:opacity-50"
                            >
                                {createIssueMutation.isPending ? 'Creating...' : 'Create Issue'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Issue Modal */}
            {editingIssue && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-background border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                            <h3 className="text-xl font-black tracking-tight">Edit Issue</h3>
                            <button onClick={() => setEditingIssue(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Title</label>
                                <input
                                    type="text"
                                    value={editingIssue.title}
                                    onChange={(e) => setEditingIssue({ ...editingIssue, title: e.target.value })}
                                    className="w-full bg-muted/10 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-accent outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</label>
                                <textarea
                                    value={editingIssue.description || ''}
                                    onChange={(e) => setEditingIssue({ ...editingIssue, description: e.target.value })}
                                    className="w-full bg-muted/10 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-accent outline-none min-h-[100px] resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Priority</label>
                                    <select
                                        value={editingIssue.priority}
                                        onChange={(e) => setEditingIssue({ ...editingIssue, priority: e.target.value })}
                                        className="w-full bg-muted/10 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-accent outline-none"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Med">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</label>
                                    <select
                                        value={editingIssue.status}
                                        onChange={(e) => setEditingIssue({ ...editingIssue, status: e.target.value })}
                                        className="w-full bg-muted/10 border border-border rounded-lg p-3 text-sm focus:ring-1 focus:ring-accent outline-none"
                                    >
                                        <option value="Backlog">Backlog</option>
                                        <option value="Todo">Todo</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-muted/10 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => setEditingIssue(null)}
                                className="px-4 py-2 text-sm font-semibold hover:bg-muted rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => updateIssueMutation.mutate({ id: editingIssue.id, updates: editingIssue })}
                                className="bg-foreground text-background px-6 py-2 rounded-lg text-sm font-black hover:bg-foreground/90 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
