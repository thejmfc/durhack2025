import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import supabase from '@/Supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const eventId: string | undefined = body.eventId;

        if (eventId) {
            const { data: expenses, error } = await supabase
                .from("expenses")
                .select("*")
                .eq("event_id", eventId);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            // Total expenses
            const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + (expense.expense_amount || 0), 0);

            // Expense breakdown by category
            const categoryBreakdown: Record<string, number> = {};
            expenses.forEach((expense: any) => {
                const category = expense.expense_category || 'Uncategorized';
                categoryBreakdown[category] = (categoryBreakdown[category] || 0) + (expense.expense_amount || 0);
            });

            return NextResponse.json({
                totalExpenses,
                categoryBreakdown,
                expenses,
            });
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