import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock3, Package, ArrowRight } from 'lucide-react';
import LuxuryButton from '@/components/luxury/LuxuryButton';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order') || '';
  const paymentMethod = params.get('method') || 'whatsapp_order';
  const paymentStatus = params.get('status') || '';
  const isWhatsappOrder = paymentMethod === 'whatsapp_order';
  const isPaymentPending = !isWhatsappOrder && (paymentMethod === 'manual_upi' || paymentStatus === 'pending');
  const isRazorpay = paymentMethod === 'razorpay';
  const StatusIcon = isPaymentPending ? Clock3 : Check;
  const successMessage = isPaymentPending
    ? 'We received your order and will confirm it after matching your UPI payment reference.'
    : isWhatsappOrder
      ? 'We opened WhatsApp with your order details. Send the message there so our team can confirm availability, measurements, payment, and delivery.'
    : isRazorpay
      ? 'Your Razorpay payment is complete. Your order is saved and confirmed.'
      : 'Your order has been placed successfully.';
  const emailMessage = isPaymentPending
    ? 'A confirmation email will be sent after payment verification.'
    : isWhatsappOrder
      ? 'Our team will continue the order with you on WhatsApp.'
    : 'We will send the order confirmation to the email and phone added at checkout.';

  return (
    <main className="pt-28 pb-20 min-h-screen flex items-center justify-center">
      <motion.div
        className="max-w-lg mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className={`mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full ${
            isPaymentPending ? 'bg-gold' : 'bg-burgundy'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <StatusIcon size={28} className={isPaymentPending ? 'text-charcoal' : 'text-ivory'} />
        </motion.div>

        <span className="text-gold text-[10px] tracking-[0.3em] uppercase">
          {isPaymentPending || isWhatsappOrder ? 'Order Received' : 'Thank You'}
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-charcoal font-light mt-3 mb-4">
          {isPaymentPending ? 'Payment Verification Pending' : isWhatsappOrder ? 'Order Sent on WhatsApp' : 'Order Confirmed'}
        </h1>
        <p className="text-charcoal/60 text-sm leading-relaxed mb-2">
          {successMessage}
        </p>
        <p className="text-charcoal/50 text-xs leading-relaxed mb-4">
          {emailMessage}
        </p>
        {orderNumber && (
          <p className="text-sm mb-8">
            Order Number: <span className="text-charcoal font-medium tracking-wider">{orderNumber}</span>
          </p>
        )}

        <div className="bg-beige/50 border border-gold/10 p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Package size={16} className="text-gold" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal">What Happens Next</span>
          </div>
          <ul className="space-y-3 text-sm text-charcoal/70">
            <li>• Keep your order number for support and order enquiries.</li>
            {isPaymentPending ? (
              <>
                <li>• We will match the submitted UPI reference with the payment.</li>
                <li>• Your piece will be prepared after payment verification.</li>
              </>
            ) : (
              <>
                {isWhatsappOrder && <li>• Send the WhatsApp message to confirm this order.</li>}
                {isRazorpay && <li>• Payment is marked paid through Razorpay.</li>}
                <li>• Our team will prepare your piece with care.</li>
              </>
            )}
            <li>• We will notify you when your order ships.</li>
            <li>• Estimated delivery after confirmation: 5–7 business days.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/collections">
            <LuxuryButton variant="primary">
              Continue Shopping
            </LuxuryButton>
          </Link>
          <Link to="/account" className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-charcoal hover:text-burgundy luxury-transition">
            View Orders <ArrowRight size={12} />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
