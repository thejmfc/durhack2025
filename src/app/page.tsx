"use client";
import Chat from '../components/talkjs';
import Box from '../components/box';

export default function Home() {
    return (
        <>
            <div className="min-h-screen w-full bg-[#020617] relative">
                {/* Dark Sphere Grid Background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "#020617",
                        backgroundImage: `
                            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
                            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.18) 0%, transparent 70%)
                        `,
                        backgroundSize: "32px 32px, 32px 32px, 100% 100%",
                    }}
                />
                <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@700&display=swap');`}
                </style>

                <div className="min-h-screen relative z-10 bg-transparent">
                    <div className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.04),transparent_3px,transparent_15px)]"></div>

                    <div className="container mx-auto px-8 py-12 max-w-5xl relative z-10">
                        {/* Heading */}
                        <div className="max-w-3xl mx-auto text-center mb-12">
                            <div className="relative inline-block">
                                <h1
                                    style={{ fontFamily: "'Exo 2', 'Poppins', 'Manrope', sans-serif" }}
                                    className="
                                        text-5xl md:text-6xl font-extrabold tracking-tight leading-snug
                                        text-transparent bg-clip-text
                                        bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                                        drop-shadow-[0_4px_35px_rgba(139,92,246,0.55)]
                                        transition-all duration-500
                                        mb-3
                                        "
                                >
                                    Hacksmith
                                </h1>
                                {/* Optional blurred glow behind the text for layered pop */}
                                <div className="
                                  absolute left-0 right-0 top-0 bottom-0
                                  rounded-lg
                                  pointer-events-none
                                  blur-xl opacity-60
                                  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                                  -z-10
                                " />
                            </div>
                            <p className="mt-3 text-lg text-slate-300 tracking-wide font-light max-w-2xl mx-auto">
                                Forge Your Best Hackathon Yet!
                            </p>
                        </div>


                        {/* Welcome Box */}
                        <Box className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10 transition-all group hover:shadow-indigo-900/40 hover:bg-white/20">
                            <h2 className="text-2xl text-slate-100 font-semibold mb-3 tracking-tight">
                                Welcome to Hacksmith!
                            </h2>
                            <p className="text-slate-300 leading-relaxed text-base font-normal">
                                Become part of our vibrant community of hackers and creators. Innovate and tackle all associated problems with Hackathon organistion head on!
                            </p>
                        </Box>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14 max-w-6xl mx-auto">
                            {[
                                {
                                    title: "Amazing Platform",
                                    quote: '"This is really good."',
                                    author: "Emma N."
                                },
                                {
                                    title: "Great Experience",
                                    quote: '"Top tier tool!"',
                                    author: "James M."
                                },
                                {
                                    title: "Highly Recommended",
                                    quote: '"I loved the award winning* AI integration"',
                                    author: "Prosanta G."
                                }
                            ].map(({ title, quote, author }, idx) =>
                                <Box
                                    key={idx}
                                    className="backdrop-blur-lg bg-white/10 rounded-3xl p-7 shadow-md transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg hover:bg-white/20 border border-white/10 text-left"
                                >
                                    <span className="absolute left-0 top-4 w-1 h-10 bg-indigo-500 rounded-full"></span>
                                    <h3 className="text-xl font-semibold text-slate-100 mb-3">{title}</h3>
                                    <p className="italic text-slate-300 text-base">{quote}</p>
                                    <p className="mt-3 text-sm text-slate-400 font-light">- {author}</p>
                                </Box>
                            )}
                        </div>

                        {/* CTAs */}
                        <div className="flex justify-center gap-6 mt-14">
                            <a href="/auth/signup"
                               className="px-10 py-3 bg-orange-500 hover:bg-orange-600 text-slate-50 text-base font-semibold rounded-full shadow-xl transition focus:ring-4 focus:ring-orange-400 focus:ring-opacity-60"
                            >
                                Sign Up
                            </a>
                            <a href="/auth/login"
                               className="px-10 py-3 border border-slate-200 hover:border-slate-300 text-slate-200 bg-white/10 rounded-full text-base font-semibold shadow-md transition focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-25"
                            >
                                Sign In
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
