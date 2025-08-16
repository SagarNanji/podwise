import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChatInterface } from "@/components/ChatInterface";

const ChatPage: React.FC = () => {
  // This param is the SESSION id, not the chatId
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  if (!sessionId) {
    navigate("/index");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--page-bg)] text-[var(--text)]">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-6">
        <ChatInterface sessionId={sessionId} onBack={() => navigate(-1)} />
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;
