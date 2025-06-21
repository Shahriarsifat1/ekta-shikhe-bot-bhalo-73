
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showAdminButton?: boolean;
}

export const Header = ({ showAdminButton = true }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
            <img 
              src="/lovable-uploads/827fa798-e3ed-47a8-ade8-f0774aac7316.png" 
              alt="আদ্রিতা জান্নাত"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-medium text-white">
              আদ্রিতা
            </h1>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/90">অনলাইন</span>
            </div>
          </div>
        </div>
        
        {showAdminButton && (
          <Button
            onClick={() => navigate("/admin")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 px-3 py-1 text-xs"
          >
            <Settings className="h-3 w-3 mr-1" />
            এডমিন
          </Button>
        )}
      </div>
    </header>
  );
};
