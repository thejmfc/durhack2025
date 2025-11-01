import {ButtonHTMLAttributes} from 'react';
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'ghost';
};

export default function Button({ loading, disabled, className, variant = "primary", children, ...rest }: Props) {
    const base = "inline-flex items-center justify-center rounded px-4 py-2 text-sm transition focus:outline-none disabled:opacity-50";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost: "bg-transparent text-gray-900 hover:bg-gray-100"
    } as const;

    return (
        <button
            {...rest}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={clsx(base, variants[variant], className)}
        >
            {loading && <span className="mr-2 inline-block h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />}
            {children}
        </button>
    );
}

