
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 flex flex-col">
        <div className="flex-1 max-w-full mx-auto w-full">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default Index;
