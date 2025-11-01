"use client"
import { useEffect, useState } from "react";

export default function Home() {
  const greetings = ["Hello", "Hi", "Heya", "EUAN IM WATCHING YOU"]
  const [greeting, setGreeting] = useState<string | null>(null);


  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)])
  }, [])


  return (
   <h1>{greeting}</h1>
  );
}
