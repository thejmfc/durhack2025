"use client"
import Chat from '../components/talkjs';
import Box from '../components/box';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800">
      <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
              HackSmith
          </h1>
          <p className="text-xl text-purple-200">
        Forge Your Best Hackathon Yet!
        </p>
      </div>

      <Box className="backdrop-blur-sm bg-white/10 rounded-xl shadow-2xl p-8 max-w-2xl mx-auto transform hover:scale-105 hover:bg-violet-900/30 transition-all duration-300">
        <h2 className="text-2xl font-bold text-white mb-4">
        Welcome to HackSmith!
        </h2>
        <p className="text-purple-100 mb-6">
        Become part of our vibrant community of hackers and creators. Collaborate, innovate, and tackle challenges together!
        </p>
      </Box>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Box className="backdrop-blur-sm bg-white/10 rounded-xl p-6 transform hover:scale-105 hover:bg-violet-900/30 transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-2">Amazing Platform</h3>
          <p className="text-purple-100">"This is really good."</p>
          <p className="text-purple-200 mt-2">- Emma N.</p>
        </Box>
        <Box className="backdrop-blur-sm bg-white/10 rounded-xl p-6 transform hover:scale-105 hover:bg-violet-900/30 transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-2">Great Experience</h3>
          <p className="text-purple-100">"Top tier tool!"</p>
          <p className="text-purple-200 mt-2">- James M.</p>
        </Box>
        <Box className="backdrop-blur-sm bg-white/10 rounded-xl p-6 transform hover:scale-105 hover:bg-violet-900/30 transition-all duration-300">
          <h3 className="text-xl font-bold text-white mb-2">Highly Recommended</h3>
          <p className="text-purple-100">"I loved the award winning* ai integration"</p>
          <p className="text-purple-200 mt-2">- Prosanta G.</p>
        </Box>
        <div className="col-span-full flex justify-center items-center gap-4 mt-8">
          <a href="/auth/signup" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-bold transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
          Sign Up
          </a>
          <a href="/auth/login" className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-bold transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
          Sign In
          </a>
        </div>
        </div>
      </div>
    // </div>
  );
}
