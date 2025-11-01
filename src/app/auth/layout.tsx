import RequireGuest from "@/src/context/RequireGuest";

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