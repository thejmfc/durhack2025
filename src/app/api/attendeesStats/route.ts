import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const eventId: string | undefined = body.eventId;

        if (eventId) {
            const { data: attendees, error } = await supabase
                .from("attendees")
                .select("*")
                .eq("event_id", eventId);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            // Age range
            const ages = attendees.map((a: any) => a.age).filter((a: number) => typeof a === 'number');
            const minAge = ages.length ? Math.min(...ages) : null;
            const maxAge = ages.length ? Math.max(...ages) : null;

            // Gender breakdown
            const genderCounts: Record<string, number> = {};
            attendees.forEach((a: any) => {
                const gender = a.gender || 'Unspecified';
                genderCounts[gender] = (genderCounts[gender] || 0) + 1;
            });

            // Dietary breakdown
            const dietaryCounts: Record<string, number> = {};
            attendees.forEach((a: any) => {
                const dietary = a.dietary || 'None';
                dietaryCounts[dietary] = (dietaryCounts[dietary] || 0) + 1;
            });

            // Total attendees
            const total = attendees.length;

            return NextResponse.json({
                total,
                ageRange: { min: minAge, max: maxAge },
                genderBreakdown: genderCounts,
                dietaryBreakdown: dietaryCounts,
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
