import RequireGuest from "@/context/RequireGuest";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireGuest>
        {children}
    </RequireGuest>
  );
}