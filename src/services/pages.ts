import { supabase } from '@/lib/supabase';

export const pagesService = {
    async getPages(workspaceId: string) {
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    async getPage(id: string) {
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async createPage(page: { title: string; content: any; workspace_id: string; author_id: string }) {
        const { data, error } = await supabase
            .from('pages')
            .insert(page)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updatePage(id: string, updates: { title?: string; content?: any }) {
        const { data, error } = await supabase
            .from('pages')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};
