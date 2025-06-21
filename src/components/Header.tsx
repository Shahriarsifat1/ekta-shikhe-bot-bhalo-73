
import { Settings, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  showAdminButton?: boolean;
}

export const Header = ({ showAdminButton = true }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img 
              src="/lovable-uploads/827fa798-e3ed-47a8-ade8-f0774aac7316.png" 
              alt="আদ্রিতা জান্নাত"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">
              আদ্রিতা জান্নাত
            </h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-sm text-white/90">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showAdminButton && (
            <Button
              onClick={() => navigate("/admin")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              এডমিন
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
