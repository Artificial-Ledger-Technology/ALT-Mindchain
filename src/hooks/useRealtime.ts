"use client";

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export function useRealtime(table: string, queryKey: string[]) {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channel = supabase
            .channel(`realtime:${table}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: table },
                (payload) => {
                    console.log(`Realtime change in ${table}:`, payload);
                    // Invalidate the query to refetch data
                    queryClient.invalidateQueries({ queryKey });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table, queryKey, queryClient]);
}
