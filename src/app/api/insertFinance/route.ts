import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventId, financeField } = body;

        if (!eventId || !financeField) {
            return NextResponse.json({ error: 'Missing eventId or financeField' }, { status: 400 });
        }

        const { expense_title, expense_amount, expense_date, expense_type, expense_category } = financeField;

        if (!expense_title || !expense_amount || !expense_date || !expense_type || !expense_category) {
            return NextResponse.json({
                error: 'Missing required fields in financeField. Required fields: expense_title, expense_amount, expense_date, expense_type, expense_category.'
            }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('expenses')
            .insert([{
                expense_title: expense_title,
                expense_amount: expense_amount,
                expense_date: expense_date,
                expense_type: expense_type,
                expense_category: expense_category,
                event_id: eventId
            }]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Finance field inserted successfully', data });
    } catch (error) {
        return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
}