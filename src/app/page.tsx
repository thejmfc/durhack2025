"use client"
import Chat from '../components/talkjs';
import Box from '../components/box';
import ChatToggle from "@/components/chattoggle";
import Button from "@/components/button";

export default function Home() {
  return (
      <div>
        <h1>Homepage</h1>
          <ChatToggle />
          <Button variant="secondary">Submit</Button>
      </div>
  );
}
