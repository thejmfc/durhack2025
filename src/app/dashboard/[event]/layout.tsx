import ChatToggle from "@/components/chattoggle";

export default function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { event: string };
}) {
  return (
    <>
      {children}
      {/* Floating AI assistant scoped to this specific event */}
      <ChatToggle eventId={params.event} />
    </>
  );
}
