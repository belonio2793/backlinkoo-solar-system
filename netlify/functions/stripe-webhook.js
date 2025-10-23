import Stripe from 'stripe';

const baseHeaders = {
  'Content-Type': 'application/json',
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripeClient = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
  : null;

function decodeEventBody(event) {
  if (!event.body) {
    return '';
  }

  return event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
}

async function handleCheckoutSessionCompleted(session) {
  const customerEmail = session.customer_details?.email || session.metadata?.email || null;
  const creditsPurchased = session.metadata?.credits ? Number(session.metadata.credits) : null;

  console.log(
    JSON.stringify(
      {
        type: 'checkout.session.completed',
        sessionId: session.id,
        customerId: session.customer || null,
        customerEmail,
        creditsPurchased,
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
      },
      null,
      2,
    ),
  );
}

async function dispatchStripeEvent(event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case 'invoice.paid':
    case 'invoice.payment_succeeded':
      console.log(
        JSON.stringify(
          {
            type: event.type,
            invoiceId: event.data.object.id,
            customerId: event.data.object.customer || null,
            amountPaid: event.data.object.amount_paid,
            currency: event.data.object.currency,
          },
          null,
          2,
        ),
      );
      break;
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        ...baseHeaders,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Stripe-Signature, Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' }),
    };
  }

  if (!stripeClient || !stripeWebhookSecret) {
    console.error('Stripe configuration missing');
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Stripe is not configured.' }),
    };
  }

  const signatureHeader = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];

  if (!signatureHeader) {
    return {
      statusCode: 400,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Missing Stripe-Signature header.' }),
    };
  }

  const rawBody = decodeEventBody(event);

  let stripeEvent;
  try {
    stripeEvent = stripeClient.webhooks.constructEvent(rawBody, signatureHeader, stripeWebhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return {
      statusCode: 400,
      headers: baseHeaders,
      body: JSON.stringify({ error: `Webhook signature verification failed: ${error.message}` }),
    };
  }

  try {
    await dispatchStripeEvent(stripeEvent);
  } catch (error) {
    console.error(`Error handling Stripe event ${stripeEvent.type}:`, error);
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({ error: 'Failed to process Stripe event.' }),
    };
  }

  return {
    statusCode: 200,
    headers: baseHeaders,
    body: JSON.stringify({ received: true }),
  };
}
