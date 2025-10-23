import { useState } from "react";
import * as React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/contexts/ModalContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserFlowProvider } from "@/contexts/UserFlowContext";
import { queryClient } from "@/lib/queryClient";
import { AppWrapper } from "@/components/AppWrapper";
import { UnifiedModalManager } from "@/components/UnifiedModalManager";
import { SupabaseErrorBoundary } from "@/components/SupabaseErrorBoundary";
import { EnhancedErrorBoundary } from "@/components/EnhancedErrorBoundary";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <UserFlowProvider>
            <ModalProvider>
              <BrowserRouter>
                <SupabaseErrorBoundary>
                  <EnhancedErrorBoundary>
                    <div className="min-h-screen bg-background text-foreground">
                      <AppWrapper />
                    </div>
                    <UnifiedModalManager />
                  </EnhancedErrorBoundary>
                </SupabaseErrorBoundary>
              </BrowserRouter>
              <Toaster />
            </ModalProvider>
          </UserFlowProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
