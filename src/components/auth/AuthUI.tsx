"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, Lock, UserPlus, LogIn, Github, Eye, EyeOff } from 'lucide-react';

export default function AuthUI() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    }
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleGithubLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: window.location.origin }
        });
    };

    return (
        <div className="w-full max-w-md space-y-6 bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent/30 transition-all duration-500" />

            <div className="text-center space-y-2 relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-white">{isSignUp ? 'Create account' : 'Welcome back'}</h2>
                <p className="text-muted-foreground text-sm">
                    {isSignUp ? 'Start your cosmic journey today' : 'Log in to your Mindchain workspace'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4 relative z-10">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-white text-muted-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`p-3 rounded-xl text-xs font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                            {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                            <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                        </>
                    )}
                </button>
            </form>

            <div className="relative z-10">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0a0a0a] px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <button
                onClick={handleGithubLogin}
                className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 relative z-10"
            >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
            </button>

            <p className="text-center text-sm text-muted-foreground relative z-10">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-white font-bold hover:underline underline-offset-4"
                >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </div>
    );
}
