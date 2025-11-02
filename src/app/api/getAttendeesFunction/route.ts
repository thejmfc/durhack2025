import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper to build Supabase filter from rules
function applyRules(query: any, rules: Record<string, any>) {
  if (!rules || typeof rules !== 'object') return query;
  Object.entries(rules).forEach(([field, condition]) => {
    if (typeof condition === 'object' && condition !== null) {
      Object.entries(condition).forEach(([op, value]) => {
        switch (op) {
          case 'eq': query = query.eq(field, value); break;
          case 'neq': query = query.neq(field, value); break;
          case 'lt': query = query.lt(field, value); break;
          case 'lte': query = query.lte(field, value); break;
          case 'gt': query = query.gt(field, value); break;
          case 'gte': query = query.gte(field, value); break;
          case 'in': query = query.in(field, value); break;
        }
      });
    } else {
      query = query.eq(field, condition);
    }
  });
  return query;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventId: string | undefined = body.eventId;
    const rules = body.rules || {};
    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
    }
    // Only allow these fields in rules
    const allowedFields = [
      'first_name',
      'last_name',
      'age',
      'gender',
      'phone_number',
      'email_address',
      'dietary_requirements',
    ];
    const filteredRules: Record<string, any> = {};
    Object.entries(rules).forEach(([field, value]) => {
      if (allowedFields.includes(field)) {
        filteredRules[field] = value;
      }
    });
    let query = supabase.from('attendees').select('*').eq('event_id', eventId);
    query = applyRules(query, filteredRules);
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ attendees: data });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
