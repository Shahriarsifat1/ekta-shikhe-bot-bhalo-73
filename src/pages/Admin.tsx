
import { Header } from "@/components/Header";
import { LearningInterface } from "@/components/LearningInterface";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header showAdminButton={false} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            মূল পেজে ফিরে যান
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              এডমিন প্যানেল - সাজিদা
            </h1>
            <p className="text-lg text-gray-600">
              এখানে থেকে আদ্রিতা জান্নাত বটকে ট্রেইন করুন
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="learn" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="learn" className="text-sm font-medium">
                📚 বট ট্রেইনিং
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="text-sm font-medium">
                🧠 নলেজ বেস
              </TabsTrigger>
            </TabsList>

            <TabsContent value="learn" className="mt-0">
              <LearningInterface />
            </TabsContent>

            <TabsContent value="knowledge" className="mt-0">
              <KnowledgeBase />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
