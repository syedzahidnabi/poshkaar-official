# Base44 Project

Use this repository to run and edit the app locally, then publish changes back through Base44.

Any change pushed to the repo will also be reflected in the Base44 Builder.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.
4. Install the Base44 CLI: `npm install -g base44@latest`.

See the [Base44 CLI docs](https://docs.base44.com/developers/references/cli/get-started/overview) if you want to run Base44 commands directly.

## Run Locally

Run the full local development environment from the project root:

```bash
base44 dev
```

`base44 dev` starts the local Base44 development backend and, when this app is configured for it, also starts the frontend dev server for you. Use the frontend URL printed by the command.

For example, when the Base44 project config includes a `serveCommand`, `base44 dev` can launch the frontend too:

```json5
{
  "site": {
    "serveCommand": "npm run dev"
  }
}
```

In a Base44 project this lives in `base44/config.jsonc`.

## Run Only The Frontend

If you only want to work on the frontend against the hosted Base44 backend, run:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Use The Hosted Backend

For frontend-only development, create or update `.env.local` in the project root:

```bash
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

`VITE_BASE44_APP_ID` identifies the Base44 app.

`VITE_BASE44_APP_BASE_URL` tells the Base44 Vite plugin where to send local `/api` requests. Point it at your deployed Base44 app URL when you want the local frontend to use the hosted backend.

When you use `base44 dev`, the command injects the local Base44 values for you, so `.env.local` is mainly needed for frontend-only workflows.

## Free Backend Alternative: Supabase

If Base44 CLI login/deploy is blocked, this repo can also run against Supabase free tier for production auth, orders, admin order data, wishlist, newsletter signups, and order email function invocation.

1. Create a Supabase project.
2. Open Supabase **SQL Editor**, run `supabase/schema.sql`, then run `supabase/production-commerce-hardening.sql`. The second migration is required before accepting real orders.
3. Copy `.env.example` to `.env.local` and set:

```bash
VITE_BACKEND_PROVIDER=supabase
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_ADMIN_EMAILS=poshkaarkashmirofficial@gmail.com
VITE_RAZORPAY_KEY=your_razorpay_key_id
VITE_RAZORPAY_UPI_ID=your-upi-id@bank
VITE_WHATSAPP_ORDER_NUMBER=916006491824
```

4. Deploy these Supabase Edge Functions:

```bash
npx supabase functions deploy create-checkout-order --project-ref your-project-ref --no-verify-jwt
npx supabase functions deploy create-razorpay-order --project-ref your-project-ref --no-verify-jwt
npx supabase functions deploy verify-razorpay-payment --project-ref your-project-ref --no-verify-jwt
npx supabase functions deploy send-order-confirmation --project-ref your-project-ref --no-verify-jwt
```

5. Add these Supabase function secrets:

```bash
SUPABASE_SECRET_KEY=your_supabase_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Poshkaar Kashmir <orders@yourdomain.com>
ORDER_NOTIFICATION_EMAIL=poshkaarkashmirofficial@gmail.com
ORDER_WHATSAPP_WEBHOOK_URL=https://your-whatsapp-automation-webhook
ORDER_WHATSAPP_WEBHOOK_SECRET=optional_shared_secret
ORDER_NOTIFICATION_WHATSAPP=916006491824
```

Do not add `SUPABASE_SECRET_KEY` or `RAZORPAY_KEY_SECRET` to any `VITE_` variable. `VITE_` values are shipped to the browser. Secret keys belong only in Supabase Edge Function secrets or a private server environment.

`ORDER_WHATSAPP_WEBHOOK_URL` is optional. Leave it empty until you connect a WhatsApp provider such as WhatsApp Cloud API, WATI, Interakt, Make, or Zapier. When it is set, the order email function will also POST WhatsApp-ready order notification payloads for the owner and the customer, then mark the WhatsApp notification timestamps.

`VITE_WHATSAPP_ORDER_NUMBER` is the customer-facing WhatsApp number used by the “Customize” and “Order on WhatsApp” buttons. Use country code only, without `+` or spaces.

If checkout says `Could not find the table 'public.orders'` or mentions the `schema cache`, the Supabase tables have not been created yet. Run `supabase/schema.sql` in the Supabase SQL Editor, then refresh the website.

### Razorpay checkout flow

The checkout uses a production-safe Razorpay flow:

1. `create-checkout-order` validates every product against Supabase, calculates prices and shipping on the server, saves the order and order items, and reserves stock.
2. `create-razorpay-order` creates a Razorpay order from the server-owned total using `RAZORPAY_KEY_SECRET`.
3. Razorpay Checkout opens in the browser.
4. `verify-razorpay-payment` verifies the Razorpay signature on the server.
5. An idempotent database function records the payment, updates stock and marks the order `paid` and `confirmed` only after server verification succeeds.

### Enable Google sign-in

If clicking "Continue with Google" shows `Unsupported provider: provider is not enabled`, Supabase is connected but Google OAuth is still disabled.

1. In Supabase, open **Authentication -> Sign In / Providers -> Google**.
2. Turn Google on.
3. Add the Google OAuth **Client ID** and **Client Secret** from Google Cloud Console.
4. In Google Cloud Console, add this authorized redirect URI:

```bash
https://your-project-ref.supabase.co/auth/v1/callback
```

For this project, replace `your-project-ref` with your actual Supabase project ref.

5. In Supabase **Authentication -> URL Configuration**, set local development redirects:

```bash
http://localhost:5173
http://localhost:5173/**
```

Add your production domain here before launch.

The storefront labels local fallback records as a catalogue preview. Secure Supabase checkout accepts only product IDs and prices that exist in the `products` table; preview records must not be used for real orders.

## Publish Your Changes

After pushing your changes to git, open the Base44 dashboard and publish the app:

```bash
base44 dashboard open
```

## Docs & Support

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Base44 CLI command reference: [https://docs.base44.com/developers/references/cli/commands/introduction](https://docs.base44.com/developers/references/cli/commands/introduction)

Support: [https://app.base44.com/support](https://app.base44.com/support)
