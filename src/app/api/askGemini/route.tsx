import { NextRequest, NextResponse } from "next/server";
import { askGemini } from "@/components/gemini";
import supabase from "@/Supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question: string = body.question || "";
    const eventId: string | undefined = body.eventId;
    const extraContext: string = body.context || "";

    let eventContext = "";
    let organisersContext = "";
    let sponsorContext = "";
    let expenseContext = "";
    let attendeeContext = "";

    if (eventId) {
      const { data: event, error: eventError } = await supabase
        .from("hackathons")
        .select("*")
        .eq("event_id", eventId)
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
      } else if (name === 'getAttendeesFunction') {
        const res = await fetch(`${req.nextUrl.origin}/api/getAttendeesFunction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: eventId, rules: args.rules }),
        });
        const data = await res.json();
        const followupPrompt = `The function getAttendeesFunction was called and returned the following result: ${JSON.stringify(data)}.\n\nPlease provide a user-friendly answer to the original question: ${question}`;
        const followupAnswer = await askGemini(followupPrompt, combinedContext);
        return NextResponse.json({ answer: typeof followupAnswer === 'string' ? followupAnswer : JSON.stringify(followupAnswer), function_call: true });
      }

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

    const { data: attendees, error: attendError } = await supabase
        .from("attendees")
        .select("first_name, last_name, age, gender, dietary_requirements")
        .eq("event_id", eventId)

    if (attendError) {
        console.error("Error fetching attendees:", attendError.message)
    } else if (attendees && attendees.length) {
        const list = attendees
            .map((a: any) => {
                const name = [a.first_name, a.last_name].filter(Boolean).join(" ") || "(no name)";
                const age = a.age;
                const gender = a.gender;
                const phone = a.phone_number;
                const email = a.email_address;
                const diet = a.dietary_requirements;
                
                return `• Name: ${name}, Age: ${age}, Gender: ${gender}, Phone Number: ${phone}, E-mail Address: ${email}, Dietary Requirements: ${diet}`
            })
            .join("\n")
        attendeeContext = `Attendee Details: \n${list}`
    }

    const combinedContext = [eventContext, organisersContext, expenseContext, sponsorContext, attendeeContext, extraContext].filter(Boolean).join("\n\n");
    const geminiResult = await askGemini(question, combinedContext);


    if (typeof geminiResult === 'object' && geminiResult.function_call) {
      const { name, arguments: args } = geminiResult.function_call;
      if (name === 'countAttendeesFunction') {
        const res = await fetch(`${req.nextUrl.origin}/api/countAttendeesFunction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: eventId }),
        });
        const data = await res.json();
        const followupPrompt = `The function countAttendeesFunction was called and returned the following result: ${JSON.stringify(data.result ?? data.count ?? data)}.\n\nPlease provide a user-friendly answer to the original question: ${question}`;
        const followupAnswer = await askGemini(followupPrompt, combinedContext);
        return NextResponse.json({ answer: typeof followupAnswer === 'string' ? followupAnswer : JSON.stringify(followupAnswer), function_call: true });
      } else if (name === 'removeAttendeesFunction') {
        const res = await fetch(`${req.nextUrl.origin}/api/removeAttendeesFunction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: eventId, rules: args.rules }),
        });
        const data = await res.json();
        const followupPrompt = `The function removeAttendeesFunction was called and returned the following result: ${JSON.stringify(data.result ?? data)}.\n\nPlease provide a user-friendly answer to the original question: ${question}`;
        const followupAnswer = await askGemini(followupPrompt, combinedContext);
        return NextResponse.json({ answer: typeof followupAnswer === 'string' ? followupAnswer : JSON.stringify(followupAnswer), function_call: true });

      } else if (name === 'attendeesStatsFunction') {
        const res = await fetch(`${req.nextUrl.origin}/api/attendeesStats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId }),
        });
        const data = await res.json();
        const followupPrompt = `The function attendeesStatsFunction was called and returned the following result: ${JSON.stringify(data)}.\n\nPlease provide a user-friendly answer to the original question: ${question}`;
        const followupAnswer = await askGemini(followupPrompt, combinedContext);
        return NextResponse.json({ answer: typeof followupAnswer === 'string' ? followupAnswer : JSON.stringify(followupAnswer), function_call: true });
      } else if (name === 'getAttendeesFunction') {
        const res = await fetch(`${req.nextUrl.origin}/api/getAttendeesFunction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, rules: args.rules }),
        });
        const data = await res.json();
        const followupPrompt = `The function getAttendeesFunction was called and returned the following result: ${JSON.stringify(data)}.\n\nPlease provide a user-friendly answer to the original question: ${question}`;
        const followupAnswer = await askGemini(followupPrompt, combinedContext);
        return NextResponse.json({ answer: typeof followupAnswer === 'string' ? followupAnswer : JSON.stringify(followupAnswer), function_call: true });
      } else if (name === 'expensesFunction') {
        // Handle expensesFunction: get, add, delete
        let apiUrl = `${req.nextUrl.origin}/api/expensesFunction`;
        let fetchOptions: any = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

        if (args && args.action === 'add') {
          // Validate required fields for the add action
          if (!args.description || !args.amount || !args.transactionType) {
            console.error('Missing required fields for expensesFunction add action:', args);
            return NextResponse.json({ error: 'Missing required fields for add action' }, { status: 400 });
          }

          fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventId,
              expense_title: args.description, // Updated to match `description` field
              expense_amount: args.amount, // Updated to match `amount` field
              expense_type: args.transactionType, // Updated to match `transactionType` field
              expense_date: args.expense_date || new Date().toISOString(), // Default to current date if not provided
              expense_category: args.expense_category || 'Uncategorized', // Default category if not provided
            }),
          };
        } else if (args && args.action === 'delete') {
          fetchOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: args.id }),
          };
        } else {
          // GET: pass eventId as query param
          apiUrl += `?eventId=${encodeURIComponent(eventId ?? '')}`;
          fetchOptions = { method: 'GET' };
        }

        const res = await fetch(apiUrl, fetchOptions);
        let data;
        const text = await res.text(); // Read the raw response text

        try {
          data = text ? JSON.parse(text) : {}; // Attempt to parse JSON
        } catch (e) {
          console.error("Failed to parse JSON response from expensesFunction:", e);
          data = { error: "Invalid JSON response from expensesFunction", rawResponse: text };
        }

        // Debug: Log the raw response in non-production environments
        if (process.env.NODE_ENV !== 'production') {
          console.log("Raw response from expensesFunction:", text);
        }

        const followupPrompt = `The function expensesFunction was called and returned the following result: ${JSON.stringify(data)}.\n\nPlease provide a user-friendly answer to the original question: ${question}`;
        const followupAnswer = await askGemini(followupPrompt, combinedContext);

        return NextResponse.json({
          answer: typeof followupAnswer === 'string' ? followupAnswer : JSON.stringify(followupAnswer),
          function_call: true,
        });
      }
    }

    return NextResponse.json({ answer: typeof geminiResult === 'string' ? geminiResult : JSON.stringify(geminiResult) });
  } catch (e: any) {
    console.error("Unexpected error:", e);
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 400 });
  }
}
