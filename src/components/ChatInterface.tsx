
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/services/AIService";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "👋 হ্যালো! আমি আপনার ভার্চুয়াল সহকারী সোফিয়া। কিভাবে সাহায্য করতে পারি?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await AIService.generateResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-purple-100 to-purple-50 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${
              message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}>
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                {message.type === "bot" ? (
                  <img 
                    src="/lovable-uploads/827fa798-e3ed-47a8-ade8-f0774aac7316.png" 
                    alt="আদ্রিতা জান্নাত"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                )}
              </div>
              <div className={`rounded-2xl p-4 max-w-sm ${
                message.type === "user"
                  ? "bg-purple-600 text-white rounded-br-md"
                  : "bg-white text-gray-800 rounded-bl-md shadow-sm"
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src="/lovable-uploads/827fa798-e3ed-47a8-ade8-f0774aac7316.png" 
                  alt="আদ্রিতা জান্নাত"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md p-4 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white/50">
        <div className="flex items-center space-x-3 bg-white rounded-full p-2 shadow-sm">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="প্রশ্ন লিখুন..."
            disabled={isLoading}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700 rounded-full w-10 h-10 p-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
