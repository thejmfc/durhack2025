import supabase from '@/Supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventId: string | undefined = body.eventId;

    if (eventId) {
      const { data: event, error: eventError } = await supabase
        .from("attendees")
        .select("count")
        .eq("event_id", eventId)
        .single();

      if (eventError) {
        console.error("Error fetching event:", eventError.message);
        return NextResponse.json({ error: eventError.message }, { status: 500 });
      } else if (event) {
        return NextResponse.json({ result: event.count });
      } else {
        return NextResponse.json({ result: 0 });
      }
    } else {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Unexpected error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
