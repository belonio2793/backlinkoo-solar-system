import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

const AutomationDomainsSwitcher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const current = location.pathname.startsWith("/automation") ? "automation" : "domains";

  return (
    <div className="w-full flex justify-center automation-domains-switcher">
      <Tabs value={current} onValueChange={(val) => navigate(val === "automation" ? "/automation" : "/domains")}>
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-transparent p-0">
          <TabsTrigger value="domains" className="flex items-center gap-2 rainbow-tab">
            <Globe className="h-4 w-4" />
            Domains
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2 rainbow-tab">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AutomationDomainsSwitcher;
