import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import supabase from '@/Supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const eventId: string | undefined = body.eventId;

        const expenseField = body.expenseField

        if (eventId) {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('event_id', eventId)
                .eq('expense_title', expenseField.expense_title);

            if (error) {
                return NextResponse.json({
                    result: "Delete failed",
                    error: error.message
                }, { status: 500 });
            }
            return NextResponse.json({
                result: "success",
            }, { status: 200 });

        } else {
            return NextResponse.json({
                result: "No eventID"
            }, { status: 400 });
        }
    } catch {
        return NextResponse.json({
            result: "Error"
        }, { status: 500 });
    }
}