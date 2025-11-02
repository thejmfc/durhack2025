"use client"
import ChatToggle from "@/components/chattoggle";
import { useParams } from "next/navigation";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  return (
    <>
      {children}
      {/* Floating AI assistant scoped to this specific event */}
      <ChatToggle eventId={typeof params.event === "string" ? params.event : undefined} />
    </>
  );
}
