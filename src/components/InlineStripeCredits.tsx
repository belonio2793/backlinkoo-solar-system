import { useEffect, useMemo, useState } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { loadStripe, StripeElementsOptions, Stripe as StripeJs } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function InnerCheckout({ credits, email, firstName, lastName, onSuccess }:{ credits:number; email?:string; firstName?:string; lastName?:string; onSuccess?:()=>void }){
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: { receipt_email: email, payment_method_data: { billing_details: { name: `${(firstName||'').trim()} ${(lastName||'').trim()}`.trim() || undefined } } }
      });

      if (error) {
        toast({ title: 'Payment failed', description: error.message || 'Try again', variant: 'destructive' });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({ title: 'Payment successful', description: `${credits} credits purchased` });
        onSuccess?.();
      }
    } catch (err:any) {
      console.error('confirmPayment error', err);
      toast({ title: 'Payment failed', description: err?.message || 'Try again', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <PaymentElement options={{ layout: 'tabs' }} />
      <Button className="w-full" disabled={!stripe || loading} onClick={handlePay}>
        {loading ? 'Processing…' : 'Pay securely'}
      </Button>
    </div>
  );
}

const DEFAULT_TIMEOUT = 10000;

async function fetchJsonWithTimeout(url: string, opts: RequestInit = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, ...opts });
    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch (_) { json = null; }
    return { ok: res.ok, status: res.status, json, text };
  } finally {
    clearTimeout(id);
  }
}

function buildEndpoints(path: string) {
  const env = (import.meta && (import.meta as any).env) || {};
  const candidates = [
    `/api/${path}`,
    `/.netlify/functions/${path}`,
  ];
  if (env.VITE_NETLIFY_FUNCTIONS_URL) candidates.push(`${env.VITE_NETLIFY_FUNCTIONS_URL.replace(/\/$/, '')}/${path}`);
  if (env.VITE_NETLIFY_DEV_FUNCTIONS) candidates.push(`${env.VITE_NETLIFY_DEV_FUNCTIONS.replace(/\/$/, '')}/${path}`);
  return candidates;
}

export default function InlineStripeCredits({ credits, email, firstName, lastName, onSuccess }:{ credits:number; email?:string; firstName?:string; lastName?:string; onSuccess?:()=>void }){
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripe, setStripe] = useState<StripeJs | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadConfigAndIntent = async () => {
      setClientSecret(null);
      setStripe(null);
      setError(null);

      try {
        // 1) fetch publishable key from multiple endpoints
        const publicEndpoints = buildEndpoints('public-config');
        let keyData: any = null;
        for (const url of publicEndpoints) {
          try {
            const res = await fetchJsonWithTimeout(url, { method: 'GET' }, 5000);
            if (res.ok && res.json && res.json.stripePublishableKey) {
              keyData = res.json;
              break;
            }
          } catch (e) {
            // try next
            console.debug('public-config attempt failed for', url, e instanceof Error ? e.message : e);
          }
        }
        if (!keyData || !keyData.stripePublishableKey) throw new Error('Missing publishable key from server');

        const stripeInstance = await loadStripe(keyData.stripePublishableKey);
        if (!stripeInstance) throw new Error('Failed to load Stripe.js');
        if (!mounted) return;
        setStripe(stripeInstance);

        // 2) create payment intent
        const intentEndpoints = buildEndpoints('create-payment-intent');
        let intentData: any = null;
        for (const url of intentEndpoints) {
          try {
            const res = await fetchJsonWithTimeout(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credits, email }) }, 10000);
            if (res.ok && res.json && res.json.clientSecret) {
              intentData = res.json;
              break;
            }
            // if non-ok, capture message for debug but continue
            console.debug('create-payment-intent response', url, res.status, res.json || res.text);
          } catch (e) {
            console.debug('create-payment-intent attempt failed for', url, e instanceof Error ? e.message : e);
          }
        }
        if (!intentData || !intentData.clientSecret) throw new Error('Failed to create payment intent');
        if (!mounted) return;
        setClientSecret(intentData.clientSecret);
      } catch (e:any) {
        console.error('InlineStripeCredits error', e);
        if (mounted) setError(e?.message || 'Failed to initialize secure checkout');
      }
    };

    if (credits > 0) loadConfigAndIntent();

    return () => { mounted = false; };
  }, [credits, email]);

  const options: StripeElementsOptions | undefined = useMemo(() => clientSecret ? ({ clientSecret, appearance: { theme: 'stripe' } }) : undefined, [clientSecret]);

  if (error) return <div className="text-sm text-destructive">{error}</div>;
  if (!stripe || !clientSecret) return <div className="text-sm text-muted-foreground">Preparing secure checkout…</div>;

  return (
    <Elements stripe={stripe} options={options}>
      <InnerCheckout credits={credits} email={email} firstName={firstName} lastName={lastName} onSuccess={onSuccess} />
    </Elements>
  );
}
