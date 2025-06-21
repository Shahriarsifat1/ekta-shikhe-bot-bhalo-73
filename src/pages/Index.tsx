
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            আদ্রিতা জান্নাত
          </h1>
          <p className="text-sm text-gray-600">
            আমি আপনার স্মার্ট AI সহায়ক। আমাকে যেকোনো প্রশ্ন করুন!
          </p>
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default Index;
