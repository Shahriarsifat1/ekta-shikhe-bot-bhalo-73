
import { Brain, Sparkles, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showAdminButton?: boolean;
}

export const Header = ({ showAdminButton = true }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-600" />
              <Sparkles className="h-4 w-4 text-blue-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                আদ্রিতা জান্নাত
              </h1>
              <p className="text-xs text-gray-500">Smart AI Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">আদ্রিতা জান্নাত</span>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online & Ready</span>
              </div>
            </div>
            
            {showAdminButton && (
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none hover:from-purple-600 hover:to-blue-600"
              >
                <Settings className="h-4 w-4 mr-2" />
                এডমিন
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
