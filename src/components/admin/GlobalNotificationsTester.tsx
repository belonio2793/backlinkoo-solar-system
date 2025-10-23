import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Crown, CreditCard, Receipt, UserPlus, Send, Play } from "lucide-react";

interface DemoPayloadBase {
  displayName: string;
  country: string;
  countryFlag: string;
}

export function GlobalNotificationsTester() {
  const { toast } = useToast();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [connected, setConnected] = useState(false);

  const samples = useMemo(() => [
    { name: "Alex P.", country: "United States", flag: "🇺🇸" },
    { name: "Maya K.", country: "Canada", flag: "🇨🇦" },
    { name: "Jonas R.", country: "Germany", flag: "🇩🇪" },
    { name: "Elena V.", country: "Spain", flag: "🇪🇸" },
    { name: "Yuki T.", country: "Japan", flag: "🇯🇵" },
  ], []);

  const [displayName, setDisplayName] = useState(samples[0].name);
  const [country, setCountry] = useState(samples[0].country);
  const [countryFlag, setCountryFlag] = useState(samples[0].flag);
  const [amount, setAmount] = useState(50);
  const [plan, setPlan] = useState("Pro");
  const [description, setDescription] = useState("Completed an order successfully");

  useEffect(() => {
    // Create and subscribe to the realtime channel so we receive our own broadcasts for preview
    try {
      const channel = supabase.channel("global-notifications", { config: { broadcast: { self: true } } });
      channelRef.current = channel as any;
      // Subscribe once; we don't need handlers here because GlobalNotifications component handles UI
      (channel as any)
        .subscribe((status: any) => {
          setConnected(status === "SUBSCRIBED");
        });

      return () => {
        try { supabase.removeChannel(channel as any); } catch {}
      };
    } catch (e: any) {
      console.warn("GlobalNotificationsTester: unable to open channel", e?.message || e);
      setConnected(false);
    }
  }, []);

  const pickRandom = () => {
    const s = samples[Math.floor(Math.random() * samples.length)];
    setDisplayName(s.name);
    setCountry(s.country);
    setCountryFlag(s.flag);
  };

  const send = async (event: string, payload: Record<string, any>) => {
    try {
      if (!channelRef.current) throw new Error("Channel not ready");
      await (channelRef.current as any).send({ type: "broadcast", event, payload });
      toast({ title: "Notification sent", description: `${event} broadcast dispatched`, force: true });
    } catch (err: any) {
      toast({ title: "Failed to send", description: String(err?.message || err), force: true });
    }
  };

  const common: DemoPayloadBase = { displayName, country, countryFlag };

  const sendAll = async () => {
    await send("new-user", { ...common });
    await new Promise(r => setTimeout(r, 250));
    await send("credit-purchase", { ...common, amount });
    await new Promise(r => setTimeout(r, 250));
    await send("premium-upgrade", { ...common, plan });
    await new Promise(r => setTimeout(r, 250));
    await send("transaction", { ...common, description });
  };

  return (
    <Card aria-label="Global site notifications preview">
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <Badge variant={connected ? "default" : "outline"} className="mr-1">
            {connected ? "Connected" : "Not connected"}
          </Badge>
          Global Notifications Preview
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={pickRandom} title="Randomize sample user">
            Randomize
          </Button>
          <Button onClick={sendAll} size="sm" title="Send one of each notification type">
            <Play className="h-4 w-4 mr-1" /> Send All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="flag">Flag</Label>
            <Input id="flag" value={countryFlag} onChange={(e) => setCountryFlag(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="amount">Credits Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value || 0))} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="plan">Premium Plan</Label>
            <Input id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="desc">Transaction Description</Label>
            <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <Button onClick={() => send("new-user", { ...common })} className="justify-start">
            <UserPlus className="h-4 w-4 mr-2" /> New User
          </Button>
          <Button onClick={() => send("credit-purchase", { ...common, amount })} className="justify-start" variant="outline">
            <CreditCard className="h-4 w-4 mr-2" /> Credit Purchase
          </Button>
          <Button onClick={() => send("premium-upgrade", { ...common, plan })} className="justify-start" variant="outline">
            <Crown className="h-4 w-4 mr-2" /> Premium Upgrade
          </Button>
          <Button onClick={() => send("transaction", { ...common, description })} className="justify-start" variant="outline">
            <Receipt className="h-4 w-4 mr-2" /> Transaction
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: These use Supabase Realtime broadcast on channel <code>global-notifications</code>. With the GlobalNotifications component mounted, messages should appear top-right for a quick visual preview.
        </p>
      </CardContent>
    </Card>
  );
}
