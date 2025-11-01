"use client"
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import EventCard from "../../components/event_card"

export default function NavBar(){
    const { user, session } = useAuth();
    
    return (
        <section className="flex">
            <EventCard 
                event_title="HackSheffield10"
                event_location="Sheffield, UK"
                start_date="29/11/25"
                end_date="30/11/25"
                event_description="The best hackathon ever led by the coolest person."
            />
            <EventCard 
                event_title="DurHackX"
                event_location="Durham, UK"
                start_date="01/11/25"
                end_date="02/11/25"
                event_description="Pretty good hacakthon, with a great graphic designer."
            />
            <EventCard 
                event_title="ICHack"
                event_location="London, UK"
                start_date="16/03/25"
                end_date="17/03/25"
                event_description="Impossible to get tickets for, harder than the eras tour."
            />
        </section>
    )
}