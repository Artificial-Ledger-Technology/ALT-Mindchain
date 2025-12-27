import { supabase } from '@/lib/supabase';

export const issuesService = {
    async getIssues(workspaceId: string) {
        const { data, error } = await supabase
            .from('issues')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async createIssue(issue: { title: string; description?: string; status: string; priority: string; workspace_id: string; author_id: string }) {
        const { data, error } = await supabase
            .from('issues')
            .insert(issue)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateIssue(id: string, updates: { title?: string; description?: string; status?: string; priority?: string }) {
        const { data, error } = await supabase
            .from('issues')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateIssueStatus(id: string, status: string) {
        return this.updateIssue(id, { status });
    },

    async deleteIssue(id: string) {
        const { error } = await supabase
            .from('issues')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },
};
