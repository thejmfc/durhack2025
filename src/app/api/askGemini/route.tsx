import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/components/gemini";
import supabase from "@/Supabase";

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get("content-type") || "";
        let question = "";
        let eventId: string | undefined;
        let extraContext = "";

        if (contentType.includes("application/json")) {
            const body = await req.json();
            question = body.question;
            eventId = body.eventId;
            extraContext = body.context || "";
        } else {
            const body = await req.json();
            question = body.question;
            eventId = body.eventId;
            extraContext = body.context || "";
        }

        let eventContext = "";
        let organisersContext = "";
        if (eventId) {
            const { data: event, error: eventErr } = await supabase
                .from("hackathons")
                .select("event_title,event_location,event_start_date,event_end_date,event_description")
                .eq("event_id", eventId)
                .single();
            if (!eventErr && event) {
                eventContext = `Event: ${event.event_title}\nLocation: ${event.event_location}\nDates: ${event.event_start_date} to ${event.event_end_date}\nDescription: ${event.event_description || "(none)"}`;
            }

            // Fetch logistics/organisers linked to this event
            const { data: organisers, error: orgErr } = await supabase
                .from("organiser")
                .select("first_name,last_name,role,email_address,phone_number")
                .eq("event_id", eventId)
                .limit(50);

            if (!orgErr && organisers && organisers.length) {
                const list = organisers.map((o: any) => {
                    const name = [o.first_name, o.last_name].filter(Boolean).join(" ") || "(no name)";
                    const role = o.role ? ` (${o.role})` : "";
                    const contactParts = [o.email_address, o.phone_number].filter(Boolean);
                    const contact = contactParts.length ? ` – ${contactParts.join(" | ")}` : "";
                    return `• ${name}${role}${contact}`;
                }).join("\n");
                organisersContext = `Organisers / Logistics team (max 50 listed):\n${list}`;
            }
        }

        const combinedContext = [eventContext, organisersContext, extraContext].filter(Boolean).join("\n\n");
        const answer = await askGemini(question, combinedContext);
        return NextResponse.json({ answer });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 400 });
    }
}
