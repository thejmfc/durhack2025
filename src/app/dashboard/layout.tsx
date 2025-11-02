import RequireAuth from "@/context/RequireAuth";

export default function DashboardLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RequireAuth>
            {children}
        </RequireAuth>
    );
}
