import { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor: string;
  error?: string | null;
  helperText?: string;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, error, helperText, children }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-800">{label}</label>
      {children}
      {error ? (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
}
