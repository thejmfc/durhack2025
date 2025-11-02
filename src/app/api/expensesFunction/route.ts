import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/Supabase';

// GET: Return all expenses for a given event (eventId required as query param)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  if (!eventId) {
    return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('event_id', eventId)
    .order('expense_date', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ expenses: data });
}

// POST: Add a new expense (expects eventId, expense_title, expense_amount, expense_type, expense_date, expense_category)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { eventId, expense_title, expense_amount, expense_type, expense_date, expense_category } = body;
  // Validate expense_type
  if (expense_type !== 'income' && expense_type !== 'withdrawal') {
    return NextResponse.json({ error: 'expense_type must be either "income" or "withdrawal"' }, { status: 400 });
  }
  if (!eventId || !expense_title || typeof expense_amount !== 'number' || !expense_type || !expense_date || !expense_category) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        event_id: eventId,
        expense_title: expense_title,
        expense_amount: expense_amount,
        expense_type: expense_type,
        expense_date: expense_date,
        expense_category: expense_category,
      },
    ])
    .select()
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ expense: data });
}

// DELETE: Remove an expense by id (expects id in body)
export async function DELETE(req: NextRequest) {
  let id;
  try {
    const body = await req.json();
    id = body.id;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  // Log the id for debugging
  console.log("Attempting to delete expense with id:", id);

  const { data, error } = await supabase
    .from('expenses')
    .delete()
    .eq('expense_id', id) // Corrected column name
    .select();

  if (error) {
    console.error("Supabase delete error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) { // Improved check for no rows deleted
    return NextResponse.json({ error: `No expense found with id ${id}` }, { status: 404 });
  }
  return NextResponse.json({ deleted: data });
}
