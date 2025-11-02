import { ReactNode } from "react";

interface BoxProps {
    children: ReactNode;
    className?: string;
}

export default function Box({ children, className = "" }: BoxProps) {
    return (
        <div className={`p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-lg shadow-xl transition cursor-pointer hover:scale-105 hover:shadow-2xl ${className}`}>
            {children}
        </div>
    )
}
