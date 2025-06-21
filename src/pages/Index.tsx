
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <ChatInterface />
    </div>
  );
};

export default Index;
