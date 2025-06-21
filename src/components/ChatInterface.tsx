
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Smile, Paperclip, Phone, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIService } from "@/services/AIService";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  messageType?: "text" | "voice" | "image";
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "👋 হ্যালো! আমি আদ্রিতা, আপনার ভার্চুয়াল সহকারী। কিভাবে সাহায্য করতে পারি?",
      timestamp: new Date(),
      messageType: "text"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
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
      timestamp: new Date(),
      messageType: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate typing delay
      setTimeout(() => setIsTyping(false), 1500);
      
      const response = await AIService.generateResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        timestamp: new Date(),
        messageType: "text"
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
      }, 2000);
    } catch (error) {
      console.error("Error generating response:", error);
      setIsTyping(false);
      toast({
        title: "ত্রুটি",
        description: "কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।",
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

  const quickResponses = [
    "আপনার নাম কি?",
    "আজকের আবহাওয়া কেমন?",
    "সাহায্য চাই",
    "ধন্যবাদ"
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col pt-16">
      {/* Quick Action Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 p-2">
        <div className="flex justify-center space-x-2">
          <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-100">
            <Phone className="h-4 w-4 mr-1" />
            কল
          </Button>
          <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-100">
            <Video className="h-4 w-4 mr-1" />
            ভিডিও
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start space-x-3 max-w-[85%] ${
              message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}>
              {message.type === "bot" && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src="/lovable-uploads/827fa798-e3ed-47a8-ade8-f0774aac7316.png" 
                    alt="আদ্রিতা"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={`rounded-2xl p-3 max-w-sm shadow-sm ${
                message.type === "user"
                  ? "bg-purple-600 text-white rounded-br-md"
                  : "bg-white text-gray-800 rounded-bl-md border border-purple-100"
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className={`text-xs mt-1 block ${
                  message.type === "user" ? "text-purple-200" : "text-gray-500"
                }`}>
                  {message.timestamp.toLocaleTimeString('bn-BD', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src="/lovable-uploads/827fa798-e3ed-47a8-ade8-f0774aac7316.png" 
                  alt="আদ্রিতা"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md p-3 shadow-sm border border-purple-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Response Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickResponses.map((response, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(response)}
                className="text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                {response}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-purple-100">
        <div className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-sm border border-purple-100">
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:bg-purple-100 rounded-full w-8 h-8 p-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="মেসেজ লিখুন..."
            disabled={isLoading}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:bg-purple-100 rounded-full w-8 h-8 p-0"
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:bg-purple-100 rounded-full w-8 h-8 p-0"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700 rounded-full w-8 h-8 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
