import { ReactNode } from "react";

interface BoxProps {
    children: ReactNode;
    classname?: string;
}

export default function Box({ children, classname= ""}: BoxProps) {
    return (
        <div className={`p-4 rounded-lg border bg-white shadow ${classname}`}>
            {children}
        </div>
    )
}