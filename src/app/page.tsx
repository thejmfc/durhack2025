"use client";
import Chat from '../components/talkjs';
import Box from '../components/box';

export default function Home() {
    return (
        <>
            {/* Import Google Font Exo 2 */}
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@700&display=swap');
        `}
            </style>

            <div className="min-h-screen relative bg-gradient-to-tr from-indigo-100 via-indigo-200 to-blue-200 animate-bgGradientSlow">
                {/* Subtle geometric background pattern */}
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-radial-gradient(circle_at_10%_10%,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_2px,transparent_3px,transparent_15px)]"></div>

                <div className="container mx-auto px-8 py-12 max-w-5xl relative z-10">
                    {/* Heading */}
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h1
                            style={{ fontFamily: "'Exo 2', sans-serif" }}
                            className="text-5xl tracking-tight text-gray-900 leading-snug font-extrabold"
                        >
                            HackSmith
                        </h1>
                        <p className="mt-3 text-lg text-gray-700 tracking-wide font-light max-w-2xl mx-auto">
                            Forge Your Best Hackathon Yet!
                        </p>
                    </div>

                    {/* Welcome Box */}
                    <Box className="backdrop-blur bg-white/80 rounded-3xl shadow-xl p-10 max-w-4xl mx-auto relative group transition-shadow hover:shadow-2xl">
                        <h2 className="text-3xl text-gray-900 font-semibold mb-6 tracking-tight">
                            Welcome to HackSmith!
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg font-light max-w-3xl">
                            Become part of our vibrant community of hackers and creators.
                            Collaborate, innovate, and tackle challenges together!
                        </p>
                    </Box>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14 max-w-6xl mx-auto">
                        {[{
                            title: "Amazing Platform",
                            quote: '"This is really good."',
                            author: "Emma N."
                        }, {
                            title: "Great Experience",
                            quote: '"Top tier tool!"',
                            author: "James M."
                        }, {
                            title: "Highly Recommended",
                            quote: '"I loved the award winning* AI integration"',
                            author: "Prosanta G."
                        }].map(({ title, quote, author }, idx) =>
                            <Box key={idx} className="backdrop-blur bg-white/70 rounded-3xl p-7 shadow-md transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg hover:bg-white/80">
                                <span className="absolute left-0 top-6 w-2 h-10 bg-indigo-600 rounded-full transition-transform group-hover:scale-y-110"></span>

                                <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{title}</h3>
                                <p className="italic text-gray-700 text-base leading-relaxed">{quote}</p>
                                <p className="mt-3 text-sm text-gray-500 font-light">- {author}</p>
                            </Box>
                        )}
                    </div>

                    {/* CTAs */}
                    <div className="flex justify-center gap-5 mt-16 max-w-6xl mx-auto">
                        <a href="/auth/signup"
                           className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-xl transition focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-60">
                            Sign Up
                        </a>
                        <a href="/auth/login"
                           className="px-10 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-full font-semibold shadow-md transition focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-25">
                            Sign In
                        </a>
                    </div>
                </div>

                {/* Animate gradient background COLORS */}
                <style>{`
          @keyframes bgGradientSlow {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-bgGradientSlow {
            background-size: 200% 200%;
            animation: bgGradientSlow 40s ease infinite;
          }
        `}</style>
            </div>
        </>
    );
}
