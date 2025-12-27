"use client";

import React from 'react';
import Image from 'next/image';
import { Space, Sparkles, Zap, Shield, Globe, Cpu } from 'lucide-react';
import AuthUI from './auth/AuthUI';

export default function LandingPage() {
    return (
        <div className="relative min-h-screen w-full bg-[#030303] text-white overflow-hidden selection:bg-accent/30">
            {/* Cosmic Background Layer */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/assets/cosmic-bg.png"
                    alt="Cosmic Background"
                    fill
                    className="object-cover opacity-60 scale-110 animate-pulse transition-transform duration-[20s] ease-in-out"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/40 to-[#030303]" />
            </div>

            {/* Floating Particles/Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse delay-700" />
            </div>

            {/* Header / Nav */}
            <header className="relative z-20 container mx-auto px-6 py-6 md:py-8 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        <span className="text-black font-black text-lg md:text-xl">M</span>
                    </div>
                    <span className="text-lg md:text-xl font-bold tracking-tighter">Mindchain</span>
                </div>

                <div className="hidden sm:block text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity">
                    Powered by <span className="text-white font-bold">Artificial Ledger Technology</span>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 pt-8 md:pt-12 pb-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="space-y-6 md:space-y-8 max-w-2xl text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-accent animate-bounce mx-auto lg:mx-0">
                        <Sparkles className="w-3 h-3" />
                        <span>The Future of Unified Workspaces</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] text-glow">
                        Think in <span className="text-accent italic">Sync</span>.
                        <br />
                        Work in <span className="italic">Chain</span>.
                    </h1>

                    <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Mindchain is a high-performance workspace connecting documentation and project management into a single, seamless cosmic thread.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4 text-left">
                        <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 lg:bg-transparent lg:p-0 lg:border-none">
                            <div className="mt-1 p-2 bg-white/5 lg:bg-white/5 rounded-lg border border-white/10">
                                <Globe className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Real-time Sync</h4>
                                <p className="text-xs text-muted-foreground">Collaborate globally with zero latency.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 lg:bg-transparent lg:p-0 lg:border-none">
                            <div className="mt-1 p-2 bg-white/5 lg:bg-white/5 rounded-lg border border-white/10">
                                <Cpu className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">AI Powered</h4>
                                <p className="text-xs text-muted-foreground">Intelligence built into every document.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Auth Section */}
                <div className="flex justify-center lg:justify-end perspective-1000 w-full">
                    <AuthUI />
                </div>
            </main>

            {/* Attribution Footer */}
            <footer className="relative z-10 border-t border-white/5 bg-[#030303]/50 backdrop-blur-md">
                <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                        <div className="text-sm font-bold opacity-30 tracking-widest uppercase">Artificial Ledger Technology</div>
                        <p className="text-xs text-muted-foreground">© 2026 ALT. All rights reserved. Mindchain is a registered trademark of ALT.</p>
                    </div>
                    <div className="flex gap-8 md:gap-12 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
