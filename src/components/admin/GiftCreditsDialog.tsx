import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Gift, CreditCard, History } from "lucide-react";
import { realAdminUserService, type RealUserDetails } from "@/services/realAdminUserService";
import { supabase } from "@/integrations/supabase/client";

interface GiftCreditsDialogProps {
  user: RealUserDetails;
  onCreditsGifted?: () => void;
  trigger?: React.ReactNode;
}

type Transaction = {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  description: string | null;
};

export function GiftCreditsDialog({ user, onCreditsGifted, trigger }: GiftCreditsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState("");
  const [reason, setReason] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      void loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('id, created_at, type, amount, description')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false })
        .limit(25);
      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      console.error('Error loading credit history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGiftCredits = async () => {
    const creditAmount = parseInt(credits);

    if (!creditAmount || creditAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of credits (greater than 0)",
        variant: "destructive"
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for gifting these credits",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);

      await realAdminUserService.giftCredits(
        user.user_id,
        creditAmount,
        reason.trim()
      );

      toast({
        title: "Credits Gifted Successfully!",
        description: `${creditAmount} credits have been gifted to ${user.display_name || user.email}`,
      });

      setCredits("");
      setReason("");
      onCreditsGifted?.();
      await loadHistory();

    } catch (error: any) {
      console.error('❌ Error gifting credits:', error);
      toast({
        title: "Failed to Gift Credits",
        description: error.message || "An error occurred while gifting credits",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickGift = async () => {
    const creditAmount = parseInt(credits);
    if (!creditAmount || creditAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Enter a number > 0", variant: "destructive" });
      return;
    }
    try {
      setIsLoading(true);
      await realAdminUserService.giftCreditsAsGift(user.user_id, creditAmount);
      toast({ title: "Gifted Successfully", description: `${creditAmount} credits gifted (description: Gift)` });
      setCredits("");
      setReason("");
      onCreditsGifted?.();
      await loadHistory();
    } catch (error: any) {
      console.error('❌ Error quick gifting credits:', error);
      toast({ title: "Failed to Gift Credits", description: error.message || "An error occurred", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCredits("");
    setReason("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          <>{trigger}</>
        ) : (
          <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
            <Gift className="h-4 w-4 mr-1" />
            Gift Credits
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            Manage Credits
          </DialogTitle>
          <DialogDescription>
            Manage credits for <strong>{user.display_name || user.email}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="add">
          <TabsList>
            <TabsTrigger value="add">Add Credits</TabsTrigger>
            <TabsTrigger value="history">
              <div className="flex items-center gap-2"><History className="h-4 w-4" /> History</div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credits">Number of Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter credits to gift..."
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  disabled={isLoading}
                />
                <div className="flex gap-2 pt-1">
                  {[10,25,50,100].map(v => (
                    <Button key={v} size="sm" variant="outline" onClick={() => setCredits(String(v))}>{v}</Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Gifting</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for gifting these credits..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This reason appears in the user's transaction history.
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg grid grid-cols-2 gap-2">
              <p className="text-sm text-muted-foreground">
                <strong>Balance:</strong> {user.currentCredits || 0}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Used:</strong> {user.totalCreditsUsed || 0}
              </p>
            </div>

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="button" onClick={handleQuickGift} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Gifting...
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4 mr-2" />
                    Quick Gift ({credits || 0})
                  </>
                )}
              </Button>
              <Button type="button" onClick={handleGiftCredits} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Gifting...
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4 mr-2" />
                    Gift {credits || 0} Credits
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="history" className="py-4">
            {loadingHistory ? (
              <div className="text-sm text-muted-foreground">Loading history...</div>
            ) : transactions.length === 0 ? (
              <div className="text-sm text-muted-foreground">No transactions found.</div>
            ) : (
              <div className="max-h-64 overflow-auto rounded border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-left p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id} className="border-t">
                        <td className="p-2">{new Date(tx.created_at).toLocaleString()}</td>
                        <td className="p-2 capitalize">{tx.type}</td>
                        <td className="p-2 text-right">{tx.amount}</td>
                        <td className="p-2">{tx.description || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
