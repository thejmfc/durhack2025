import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/components/gemini";
import supabase from "@/Supabase";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const body = await req.json();
    const question: string = body.question || "";
    const eventId: string | undefined = body.eventId;
    const extraContext: string = body.context || "";

    let eventContext = "";
    let organisersContext = "";
    let sponsorContext = "";
    let expenseContext = "";

    if (eventId) {
      // Fetch event details
      const { data: event, error: eventError } = await supabase
        .from("hackathons")
        .select("*")
        .eq("event_id", eventId) // adjust to Number(eventId) if your column is numeric
        .single();

      if (eventError) {
        console.error("Error fetching event:", eventError.message);
      } else if (event) {
        const title = event.event_title || "(no title)";
        const location = event.event_location || "(no location)";
        const start = event.event_start_date || "(no start date)";
        const end = event.event_end_date || "(no end date)";
        const desc = event.event_description || "No description provided.";

        eventContext = `Event Title: ${title}\nEvent Location: ${location}\nEvent Start: ${start}\nEvent End: ${end}\nEvent Description: ${desc}`;
      }

      // Fetch organisers linked to this event
      const { data: organisers, error: orgErr } = await supabase
        .from("organiser")
        .select("first_name,last_name,role,email_address,phone_number")
        .eq("event_id", eventId)
        .limit(50);

      if (orgErr) {
        console.error("Error fetching organisers:", orgErr.message);
      } else if (organisers && organisers.length) {
        const list = organisers
          .map((o: any) => {
            const name = [o.first_name, o.last_name].filter(Boolean).join(" ") || "(no name)";
            const role = o.role ? ` (${o.role})` : "";
            const contactParts = [o.email_address, o.phone_number].filter(Boolean);
            const contact = contactParts.length ? ` – ${contactParts.join(" | ")}` : "";
            return `• ${name}${role}${contact}`;
          })
          .join("\n");
        organisersContext = `Organisers / Logistics team (max 50 listed):\n${list}`;
      }
    }

    // Fetch finance data to this event
    const { data: expenses, error: expenseErr } = await supabase
        .from("expenses")
        .select("*")
        .eq("event_id", eventId)
        .limit(50);

    if (expenseErr) {
        console.error("Error fetching expenses:", expenseErr.message);
    } else if (expenses && expenses.length) {
        const list = expenses
            .map((o: any) => {
                const title = o.expense_title;
                const amount = o.expense_amount;
                const type = o.expense_type;
                const date = o.expense_date;
                const category = o.expense_category;
                return `• Expense Title: ${title}, Amount: £${amount}, In/Out: ${type}, Expense Date: ${date}, Expense Category: ${category}`
            })
            .join("\n")
        expenseContext = `Hacakthon Expenses (max 50 listed): \n${list}`
    }

    // Sponsors
    const { data: sponsors, error: sponsorsErr } = await supabase
        .from("sponsor")
        .select("*")
        .eq("event_id", eventId)
        .limit(50);

    if (sponsorsErr) {
        console.error("Error fetching sponsors:", sponsorsErr.message);
    } else if (sponsors && sponsors.length) {
        const list = sponsors
            .map((s: any) => {
                const name = s.sponsor_name;
                const tier = s.sponsor_tier;
                const amount = s.sponsor_amount;
                const status = s.sponsor_status;

                return `• Sponsor Name: ${name}, Amount: £${amount}, Tier: ${tier}, Status ${status}`
            })
            .join("\n")
        sponsorContext = `Sponsors (max 50 listed): \n${list}`
    }

    // Tech
    const { data: tech, error: techErr } = await supabase
        .from("tech")
        .select("*")
        .eq("event_id", eventId)
        .limit(50);

    if (techErr) {
        console.error("Error fetching tech:", techErr.message);
    } else if (tech && tech.length) {
        const list = tech
            .map((t: any) => {
                const screens = t.tech_screens;
                const sockets = t.tech_sockets;
                const extensions = t.tech_extension_leads;
                const extras = t.tech_extra_materials;

                return `• Screens Count: ${screens}, Plug Sockets count: £${sockets}, Extension Leads counts: ${extensions}, Extra materials: ${extras}`
            })
            .join("\n")
        sponsorContext = `Tech details (max 50 listed): \n${list}`
    }

    const combinedContext = [eventContext, organisersContext, expenseContext, sponsorContext, extraContext].filter(Boolean).join("\n\n");
    const answer = await askGemini(question, combinedContext);

    return NextResponse.json({ answer });
  } catch (e: any) {
    console.error("Unexpected error:", e);
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 400 });
  }
}
