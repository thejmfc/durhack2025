import { ReactNode } from "react";

interface BoxProps {
    children: ReactNode;
    className?: string;
}

export default function Box({ children, className = "" }: BoxProps) {
    return (
        <div className={`p-4 rounded-lg border bg-white shadow cursor-pointer transition hover:bg-blue-50 ${className}`}>
            {children}
        </div>
    )
}

