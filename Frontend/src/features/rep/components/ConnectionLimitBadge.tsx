import { Activity, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ConnectionLimitBadge({ 
  used, 
  limit,
  isSubscribed 
}: { 
  used: number; 
  limit: number | null;
  isSubscribed: boolean;
}) {
  if (isSubscribed || limit === null) {
    return (
      <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-full">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Premium Subscription</p>
              <p className="text-xs text-gray-600">Unlimited connection requests</p>
            </div>
          </div>
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
            ⭐ Premium
          </Badge>
        </div>
      </Card>
    );
  }
  
  const remaining = Math.max(0, limit - used);
  const percentage = Math.min(100, (used / limit) * 100);
  
  // Color coding based on usage
  const getColorClass = () => {
    if (remaining === 0) return "from-red-50 to-red-100 border-red-200";
    if (remaining <= 3) return "from-yellow-50 to-yellow-100 border-yellow-200";
    return "from-blue-50 to-blue-100 border-blue-200";
  };
  
  const getTextColor = () => {
    if (remaining === 0) return "text-red-600";
    if (remaining <= 3) return "text-yellow-600";
    return "text-blue-600";
  };
  
  return (
    <Card className={`p-4 bg-gradient-to-r ${getColorClass()}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={`h-5 w-5 ${getTextColor()}`} />
            <p className="text-sm font-semibold text-gray-900">Daily Connection Requests</p>
          </div>
          {remaining === 0 && (
            <Badge variant="destructive" className="text-xs">
              Limit Reached
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Used today:</span>
            <span className="font-bold text-gray-900">{used} / {limit}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-300 ${
                remaining === 0 ? 'bg-red-500' : remaining <= 3 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-600 text-center">
            {remaining > 0 ? (
              <span><span className="font-semibold">{remaining}</span> requests remaining</span>
            ) : (
              <span className="font-semibold text-red-600">Upgrade to Premium for unlimited requests</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}