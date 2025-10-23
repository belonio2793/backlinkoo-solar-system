import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getCorsHeaders } from "../_cors.ts";

const DEFAULT_PROMPT = "Look up the latest trends on SEO, search engine optimization, keyword research, backlinks, link building, affiliate marketing, internet marketing, online businesses, ecommerce stores, hot topics for artificial intelligence and write an original, unique tweet with hash tags with the intention of virality, engagement, views and clicks.";
const XAI_ENDPOINT = Deno.env.get("XAI_ENDPOINT") ?? "https://api.x.ai/v1/chat/completions";
const XAI_MODEL = Deno.env.get("XAI_MODEL") ?? "grok-2-latest";
const MAX_TWEET_LENGTH = 280;

function pickEnv(name: string, fallback?: string): string {
  const value = Deno.env.get(name) ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function percentEncode(input: string): string {
  return encodeURIComponent(input)
    .replace(/[!*'()]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function normalizeWhitespace(text: string): string {
  return text.replace(/[ \t\f\v]+/g, " ").replace(/\s*\n+\s*/g, " ").trim();
}

function sanitizeTweet(raw: string): string {
  let tweet = normalizeWhitespace(raw);

  if (tweet.startsWith("\"") && tweet.endsWith("\"")) {
    tweet = tweet.slice(1, -1).trim();
  }

  if (tweet.length <= MAX_TWEET_LENGTH) {
    return tweet;
  }

  const parts = tweet.split(" ");
  while (parts.length > 0 && parts.join(" ").length > MAX_TWEET_LENGTH) {
    const last = parts[parts.length - 1];
    if (last.startsWith("#")) {
      parts.pop();
    } else {
      break;
    }
  }

  tweet = parts.join(" ");
  if (tweet.length > MAX_TWEET_LENGTH) {
    tweet = tweet.slice(0, MAX_TWEET_LENGTH);
    tweet = tweet.replace(/\s+[^\s]*$/, "").trim();
  }

  return tweet;
}

async function signOAuth1(key: string, baseString: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(baseString));
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function buildParameterString(params: Record<string, string>): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => [percentEncode(key), percentEncode(value)])
    .sort((a, b) => {
      if (a[0] === b[0]) {
        return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
      }
      return a[0] < b[0] ? -1 : 1;
    });
  return entries.map(([key, value]) => `${key}=${value}`).join("&");
}

function buildSignatureBase(method: string, url: string, params: Record<string, string>): string {
  const baseUrl = url.split("?")[0];
  const paramString = buildParameterString(params);
  return `${method.toUpperCase()}&${percentEncode(baseUrl)}&${percentEncode(paramString)}`;
}

function buildAuthHeader(params: Record<string, string>): string {
  const headerParams = Object.entries(params)
    .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
    .join(", ");
  return `OAuth ${headerParams}`;
}

async function generateTweet(): Promise<string> {
  const apiKey = pickEnv("X_API");
  const systemPrompt = Deno.env.get("X_TWEET_SYSTEM_PROMPT") ?? "You are an award-winning social media strategist for Backlink ∞. Create concise, high-energy tweets that stay under 270 characters, include 3-6 relevant hashtags, never repeat recent phrasing, and aim for strong engagement.";
  const userPrompt = Deno.env.get("X_TWEET_USER_PROMPT") ?? DEFAULT_PROMPT;
  const temperature = Number(Deno.env.get("X_TWEET_TEMPERATURE") ?? "0.6");
  const maxTokens = Number(Deno.env.get("X_TWEET_MAX_TOKENS") ?? "220");

  const body = {
    model: XAI_MODEL,
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${userPrompt}\n\nRequirements:\n1. Output only the tweet text.\n2. Keep it under ${MAX_TWEET_LENGTH} characters.\n3. Include relevant hashtags.\n4. Avoid the phrases used in your previous outputs.`,
      },
    ],
  } as const;

  const response = await fetch(XAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`X_API request failed: ${response.status} ${errorMessage}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("X_API returned an invalid response");
  }

  const tweet = sanitizeTweet(content);
  if (!tweet || tweet.length === 0) {
    throw new Error("Generated tweet is empty after sanitization");
  }
  if (tweet.length > MAX_TWEET_LENGTH) {
    throw new Error("Generated tweet still exceeds the maximum length");
  }

  return tweet;
}

async function postTweet(status: string, dryRun: boolean): Promise<{ ok: boolean; status: number; body?: string }>
{
  if (dryRun) {
    return { ok: true, status: 200 };
  }

  const consumerKey = pickEnv("X_CONSUMER_KEY", Deno.env.get("X_APP_ID") ?? undefined);
  const consumerSecret = pickEnv("X_CONSUMER_SECRET");
  const accessToken = pickEnv("X_ACCESS_TOKEN");
  const accessSecret = pickEnv("X_ACCESS_SECRET", Deno.env.get("X_SECRET_ACCESS") ?? undefined);
  const endpoint = Deno.env.get("X_TWEET_ENDPOINT") ?? "https://api.twitter.com/1.1/statuses/update.json";

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomUUID().replace(/-/g, ""),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const requestParams = {
    status,
  };

  const signatureParams = { ...oauthParams, ...requestParams };
  const signatureBase = buildSignatureBase("POST", endpoint, signatureParams);
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessSecret)}`;
  const signature = await signOAuth1(signingKey, signatureBase);
  const authorization = buildAuthHeader({ ...oauthParams, oauth_signature: signature });

  const body = new URLSearchParams(requestParams);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: body.toString(),
  });

  const text = await response.text();
  return { ok: response.ok, status: response.status, body: text };
}

serve(async (req) => {
  const origin = req.headers.get("origin") ?? undefined;
  const cors = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    const dryRun = (Deno.env.get("X_TWEET_DRY_RUN") ?? "false").toLowerCase() === "true";
    const tweet = await generateTweet();
    const postResult = await postTweet(tweet, dryRun);

    if (!postResult.ok) {
      throw new Error(`Failed to publish tweet: ${postResult.status} ${postResult.body ?? ""}`);
    }

    const responseBody = {
      success: true,
      dryRun,
      tweet,
      provider: "x.ai",
      posted_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(responseBody), {
      headers: { ...cors, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("x-daily-post error", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      headers: { ...cors, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
