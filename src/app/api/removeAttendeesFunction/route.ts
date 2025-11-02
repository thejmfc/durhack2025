import supabase from '@/Supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventId: string | undefined = body.eventId;
    const rules: Record<string, any> = body.rules || {};

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }


    let query = supabase.from("attendees").delete().eq("event_id", eventId);

    // Only apply rules if rules object is not empty
    if (rules && Object.keys(rules).length > 0) {
      for (const [field, condition] of Object.entries(rules)) {
        if (typeof condition === 'object' && condition !== null) {
          for (const [op, value] of Object.entries(condition)) {
            switch (op) {
              case 'eq':
                query = query.eq(field, value);
                break;
              case 'lt':
                query = query.lt(field, value);
                break;
              case 'lte':
                query = query.lte(field, value);
                break;
              case 'gt':
                query = query.gt(field, value);
                break;
              case 'gte':
                query = query.gte(field, value);
                break;
              case 'neq':
                query = query.neq(field, value);
                break;
              case 'in':
                query = query.in(field, Array.isArray(value) ? value : [value]);
                break;
              default:
                break;
            }
          }
        } else {
          query = query.eq(field, condition);
        }
      }
    }

    const { error, count } = await query;

    if (error) {
      console.error("Error deleting attendees:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ result: `Attendees deleted successfully.`, count });
  } catch (error: any) {
    console.error("Unexpected error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
