import RequireGuest from "@/context/RequireGuest";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RequireGuest>
            {children}
        </RequireGuest>
      </body>
    </html>
  );
}