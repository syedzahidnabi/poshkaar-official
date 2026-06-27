# Poshkaar Kashmir Storefront

Professional Next.js ecommerce storefront for Poshkaar Kashmir, featuring:

- Fashion-led homepage and collection browsing
- Product galleries, stock states, color selection and custom measurements
- Persistent cart with a "Buy 2, Get 10% Off" offer
- Checkout with Razorpay order creation and signature verification
- UPI deep-link fallback and WhatsApp assisted ordering
- SEO metadata, product JSON-LD, sitemap and robots generation

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

On Windows PowerShell, if script execution blocks `npm`, use:

```bash
npm.cmd run dev
npm.cmd run build
```

## Payment Setup

Copy `.env.example` to `.env.local` and fill in your live or test credentials:

```bash
RAZORPAY_KEY_ID=rzp_test_or_live_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_POSHKAAR_UPI_ID=your-upi-id@bank
```

Razorpay checkout is server-backed. The browser sends product IDs and quantities, while `/api/razorpay/order` recalculates the trusted total from the product catalog before creating the Razorpay order. `/api/razorpay/verify` verifies the returned Razorpay signature.

## Production

```bash
npm.cmd run build
npm.cmd start
```

Set the same environment variables in your hosting provider before going live. Use Razorpay test credentials first, then switch to live keys after a successful test order.
