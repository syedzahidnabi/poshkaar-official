import crypto from "crypto";
import { NextResponse } from "next/server";

type VerifyRequest = {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Razorpay secret is not configured." },
      { status: 503 }
    );
  }

  let body: VerifyRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing Razorpay verification fields." },
      { status: 400 }
    );
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (!signaturesMatch(expected, razorpay_signature)) {
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 400 }
    );
  }

  return NextResponse.json({ verified: true });
}
