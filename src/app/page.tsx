"use client"
import Chat from '../components/talkjs';
import Box from '../components/box';

export default function Home() {
  return (
      <div>
        <h1></h1>

          <Box classname="max-w-md mx-auto mt-8">
              <h2 className="text-xl font-bold mb-2">HackBot</h2>
              <p>Use the hackbot to ask questions about Hackathon planning!</p>
          <Chat />
          </Box>
      </div>
  );
}
