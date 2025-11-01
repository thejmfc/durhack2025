"use client"
import Chat from '../components/talkjs';
import Box from '../components/box';

export default function Home() {
  return (
      <div>
        <h1>Hello</h1>

          <Box classname="max-w-md mx-auto mt-8">
              <h2 className="text-xl font-bold mb-2">Welcome</h2>
              <p>This is inside a styled Tailwind box.</p>
          <Chat />
          </Box>
      </div>
  );
}
