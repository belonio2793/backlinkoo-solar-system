import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getCorsHeaders } from '../_cors.ts';

interface CreateCampaignsRequest {
  targetUrls: string[];
  keywords?: string[];
  linksRequested: number;
}

function normalizeUrl(url: string): string {
  let u = (url || "").trim();
  if (!u) return u;
  if (!/^https?:\/\//i.test(u)) {
    if (u.startsWith("www.")) u = u.substring(4);
    u = `https://${u}`;
  }
  return u;
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return !!u.hostname;
  } catch {
    return false;
  }
}

function calcAvailable(credits: { amount?: number | null; bonus?: number | null; total_used?: number | null } | null): number {
  const amount = Number(credits?.amount || 0);
  const bonus = Number(credits?.bonus || 0);
  const used = Number(credits?.total_used || 0);
  return Math.max(0, amount + bonus - used);
}

serve(async (req) => { const origin = req.headers.get('origin') || ''; const cors = getCorsHeaders(origin);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRole) {
    return new Response(
      JSON.stringify({ error: "Service configuration error" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });

  try {
    const raw = await req.text();
    let body: CreateCampaignsRequest;
    try {
      body = JSON.parse(raw);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    // Auth: get user from bearer token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "Invalid user" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const userId = userData.user.id;

    // Validate inputs
    const targetUrls = (body.targetUrls || []).map(normalizeUrl).filter(Boolean);
    if (targetUrls.length === 0) {
      return new Response(JSON.stringify({ error: "At least one target URL is required" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
    if (targetUrls.length > 10) {
      return new Response(JSON.stringify({ error: "Maximum 10 target URLs allowed" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
    for (const u of targetUrls) {
      if (!isValidUrl(u)) {
        return new Response(JSON.stringify({ error: `Invalid URL: ${u}` }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
      }
    }

    const keywords = Array.isArray(body.keywords) ? body.keywords.map(k => String(k || "").trim()).filter(k => k.length > 0).slice(0, 5) : [];
    const linksRequested = Number(body.linksRequested);
    if (!Number.isFinite(linksRequested) || linksRequested < 1) {
      return new Response(JSON.stringify({ error: "linksRequested must be >= 1" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const totalCreditsNeeded = linksRequested * targetUrls.length;

    // Fetch credits and verify balance
    const { data: creditsRow, error: creditsErr } = await supabase
      .from("credits")
      .select("amount, bonus, total_used")
      .eq("user_id", userId)
      .maybeSingle();
    if (creditsErr) {
      return new Response(JSON.stringify({ error: "Failed to check credits" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const available = calcAvailable(creditsRow);
    if (available < totalCreditsNeeded) {
      return new Response(JSON.stringify({ error: `Insufficient credits. Need ${totalCreditsNeeded}, available ${available}` }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    // Prepare campaigns payload
    const nowIso = new Date().toISOString();
    const rows = targetUrls.map((url) => ({
      user_id: userId,
      name: `Campaign for ${url}`,
      target_url: url,
      keywords,
      links_requested: linksRequested,
      credits_used: linksRequested,
      created_at: nowIso
    }));

    // Insert campaigns (batch)
    const { data: inserted, error: insErr } = await supabase
      .from("campaigns")
      .insert(rows)
      .select("id");
    if (insErr) {
      return new Response(JSON.stringify({ error: "Failed to create campaigns", details: insErr.message }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }

    // Deduct credits
    const { data: currentCredits, error: refetchErr } = await supabase
      .from("credits")
      .select("amount, bonus, total_used")
      .eq("user_id", userId)
      .maybeSingle();
    if (refetchErr) {
      return new Response(JSON.stringify({ error: "Failed to update credits" }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const newAmount = Math.max(0, Number(currentCredits?.amount || 0) - totalCreditsNeeded);
    const newTotalUsed = Number(currentCredits?.total_used || 0) + totalCreditsNeeded;
    const { error: updErr } = await supabase
      .from("credits")
      .update({ amount: newAmount, total_used: newTotalUsed, updated_at: nowIso })
      .eq("user_id", userId);
    if (updErr) {
      return new Response(JSON.stringify({ error: "Credits deduction failed", details: updErr.message }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }

    // Record transaction
    await supabase
      .from("credit_transactions")
      .insert({ user_id: userId, amount: -totalCreditsNeeded, type: "campaign_creation", description: `Campaigns for ${targetUrls.length} URL(s)`, created_at: nowIso });

    const remaining = calcAvailable({ amount: newAmount, bonus: currentCredits?.bonus || 0, total_used: newTotalUsed });

    return new Response(
      JSON.stringify({ success: true, created: inserted?.length || 0, campaignIds: (inserted || []).map(r => r.id), remainingCredits: remaining }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Unhandled error", details: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
