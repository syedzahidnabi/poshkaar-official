import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronLeft, ChevronRight, Shield, Gift, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { formatPrice } from '@/lib/formatPrice';
import { base44, backendProvider, hasConfiguredBackend } from '@/api/base44Client';
import LuxuryButton from '@/components/luxury/LuxuryButton';
import { useToast } from '@/components/ui/use-toast';
import { calculateCheckoutTotals, GIFT_WRAP_COST } from '@/lib/commerce';
import { buildCheckoutWhatsAppMessage, getWhatsAppOrderUrl } from '@/lib/whatsappOrders';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY?.trim() || '';
const hasRazorpayCheckout = Boolean(RAZORPAY_KEY_ID) && backendProvider === 'supabase';
const isRazorpayTestMode = RAZORPAY_KEY_ID.startsWith('rzp_test_');
const upiIdValue = import.meta.env.VITE_RAZORPAY_UPI_ID?.trim() || '';
const RAZORPAY_UPI_ID = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,256}$/.test(upiIdValue)
  ? upiIdValue
  : '';
const isValidRazorpayUpi = Boolean(RAZORPAY_UPI_ID);

const loadRazorpayCheckout = () => new Promise((resolve, reject) => {
  if (typeof window === 'undefined') {
    reject(new Error('Razorpay checkout is only available in the browser.'));
    return;
  }

  if (window.Razorpay) {
    resolve(window.Razorpay);
    return;
  }

  const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(window.Razorpay), { once: true });
    existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay Checkout.')), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => resolve(window.Razorpay);
  script.onerror = () => reject(new Error('Unable to load Razorpay Checkout. Check your internet connection and try again.'));
  document.body.appendChild(script);
});

const unwrapFunctionData = (result) => result?.data || result;

const createCheckoutOrder = async (orderData) => {
  const result = await base44.functions.invoke('create-checkout-order', { order: orderData });
  const payload = unwrapFunctionData(result);
  if (!payload?.success || !payload?.order?.id) {
    throw new Error(payload?.error || 'The order could not be saved securely.');
  }
  return payload.order;
};

const getPaymentErrorMessage = (error, method = 'razorpay') => {
  const message = error?.response?.data?.error || error?.data?.error || error?.message || '';

  if (
    error?.isMissingSupabaseSchema
    || message.toLowerCase().includes('supabase database table')
    || message.toLowerCase().includes('supabase table')
  ) {
    return message;
  }

  if (message.includes('Could not find the table') || message.includes('schema cache')) {
    return 'The Supabase order tables are missing. Open Supabase SQL Editor, run supabase/schema.sql, then refresh this page.';
  }

  if (message.includes('create_checkout_order') || message.includes('create-checkout-order')) {
    return 'Secure checkout is not deployed yet. Run supabase/production-commerce-hardening.sql and deploy the create-checkout-order function.';
  }

  if (message.toLowerCase().includes('row-level security')) {
    return 'Supabase is blocking order saving. Run supabase/checkout-order-rls-fix.sql in Supabase SQL Editor, then refresh this page.';
  }

  if (error?.isExpiredSession || message.toLowerCase().includes('jwt expired')) {
    return 'Your sign-in session expired. Please refresh the page and try again. You can also sign in again from Account.';
  }

  if (message.includes('RAZORPAY_KEY_SECRET') || message.includes('RAZORPAY_KEY_ID')) {
    return 'Razorpay server keys are not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Supabase Edge Function secrets.';
  }

  if (message.toLowerCase().includes('cancel')) {
    return 'Payment was cancelled. No money was charged. You can try again.';
  }

  if (method === 'razorpay') {
    return message || 'Razorpay payment could not be completed. Please try again.';
  }

  return message || 'Your bag is safe. Please check your checkout setup and try again.';
};

const getUpiQrUrl = (upiId, amount) => {
  const payload = new URLSearchParams({
    pa: upiId,
    pn: 'Poshkaar Kashmir',
    cu: 'INR',
    am: amount.toFixed(2),
    tn: 'Order payment',
  }).toString();
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=upi://pay?${encodeURIComponent(payload)}`;
};

function InputField({
  label,
  field,
  form,
  updateField,
  type = 'text',
  required = true,
  placeholder = '',
  autoComplete,
  inputMode,
  pattern,
  title,
}) {
  return (
    <div>
      <label htmlFor={`checkout-${field}`} className="block text-[10px] tracking-[0.2em] uppercase text-charcoal mb-2">{label}</label>
      <input
        id={`checkout-${field}`}
        type={type}
        value={form[field]}
        onChange={(event) => updateField(field, event.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        title={title}
        className="w-full bg-transparent border border-gold/20 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold luxury-transition"
      />
    </div>
  );
}

export default function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef(null);

  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    address_line_1: '', address_line_2: '',
    city: '', state: '', pincode: '', country: 'India',
  });
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(
    hasRazorpayCheckout ? 'razorpay' : isValidRazorpayUpi ? 'manual_upi' : 'whatsapp_order'
  );
  const [upiReference, setUpiReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const {
    subtotal,
    shipping,
    giftWrapping: giftWrapCost,
    total,
  } = calculateCheckoutTotals(items, giftWrap);
  const isIndia = form.country.trim().toLowerCase() === 'india';

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const buildOrderData = (paymentDetails, overrides = {}) => {
    const orderNumber = `PK${Date.now().toString(36).toUpperCase()}`;
    const selectedPaymentMethod = overrides.paymentMethod || paymentMethod;

    return {
      order_number: orderNumber,
      customer_name: form.full_name.trim(),
      customer_email: form.email.trim().toLowerCase(),
      customer_phone: form.phone.trim(),
      items: items.map(i => ({
        product_id: i.product_id,
        title: i.title,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
        image: i.image,
      })),
      subtotal,
      shipping,
      total,
      shipping_address: {
        ...form,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
      },
      payment_method: selectedPaymentMethod,
      payment_status: overrides.paymentStatus || 'pending',
      payment_details: paymentDetails || null,
      gift_wrapping: giftWrap,
      gift_message: giftMessage,
      coupon_code: '',
      status: overrides.status || 'pending',
    };
  };

  const continueToPayment = () => {
    if (!formRef.current?.reportValidity()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRazorpayCheckout = async (checkoutPayload, orderData) => {
    const Razorpay = await loadRazorpayCheckout();

    return new Promise((resolve, reject) => {
      const razorpay = new Razorpay({
        key: checkoutPayload.key || RAZORPAY_KEY_ID,
        amount: checkoutPayload.amount,
        currency: checkoutPayload.currency || 'INR',
        name: 'Poshkaar Kashmir',
        description: `Order ${orderData.order_number}`,
        order_id: checkoutPayload.razorpayOrderId,
        prefill: {
          name: form.full_name.trim(),
          email: form.email.trim().toLowerCase(),
          contact: form.phone.trim(),
        },
        notes: {
          order_number: orderData.order_number,
          customer_email: form.email.trim().toLowerCase(),
        },
        theme: {
          color: '#5B3A29',
        },
        modal: {
          ondismiss: () => reject(new Error('Payment was cancelled.')),
        },
        handler: (response) => resolve(response),
      });

      razorpay.on('payment.failed', (response) => {
        reject(new Error(response?.error?.description || response?.error?.reason || 'Payment failed.'));
      });

      razorpay.open();
    });
  };

  const completeRazorpayOrder = async () => {
    if (!hasRazorpayCheckout) {
      throw new Error('Razorpay checkout is available only on the Supabase backend with VITE_RAZORPAY_KEY configured.');
    }

    const orderData = buildOrderData(
      { provider: 'razorpay', verification: 'pending' },
      { paymentMethod: 'razorpay', paymentStatus: 'pending', status: 'pending' }
    );
    const createdOrder = await createCheckoutOrder(orderData);
    const confirmedOrderNumber = createdOrder.order_number || orderData.order_number;

    const orderResult = await base44.functions.invoke('create-razorpay-order', {
      orderId: createdOrder.id,
      orderNumber: confirmedOrderNumber,
    });
    const checkoutPayload = unwrapFunctionData(orderResult);

    const paymentResponse = await openRazorpayCheckout(checkoutPayload, {
      ...orderData,
      order_number: confirmedOrderNumber,
    });

    const verificationResult = await base44.functions.invoke('verify-razorpay-payment', {
      orderId: createdOrder.id,
      orderNumber: confirmedOrderNumber,
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    });
    const verifiedPayment = unwrapFunctionData(verificationResult);

    if (!verifiedPayment?.success) {
      throw new Error(verifiedPayment?.error || 'Razorpay payment verification failed.');
    }

    await notifyOrder(createdOrder, confirmedOrderNumber);

    return {
      orderNumber: confirmedOrderNumber,
      status: verifiedPayment.paymentStatus || 'paid',
    };
  };

  const completeWhatsAppOrder = async () => {
    const orderData = buildOrderData(
      { provider: 'whatsapp', customer_initiated: true },
      { paymentMethod: 'whatsapp_order', paymentStatus: 'pending', status: 'pending' }
    );
    let whatsappWindow = null;

    if (typeof window !== 'undefined') {
      whatsappWindow = window.open('', '_blank');
    }

    let createdOrder = null;
    try {
      createdOrder = await createCheckoutOrder(orderData);
      await notifyOrder(createdOrder, createdOrder.order_number || orderData.order_number);
    } catch (orderError) {
      whatsappWindow?.close?.();
      throw orderError;
    }

    const confirmedOrderNumber = createdOrder.order_number || orderData.order_number;

    const message = buildCheckoutWhatsAppMessage({
      orderNumber: confirmedOrderNumber,
      items,
      totals: {
        subtotal,
        shipping,
        giftWrapping: giftWrapCost,
        total,
      },
      customer: form,
      giftWrap,
      giftMessage,
    });
    const whatsappUrl = getWhatsAppOrderUrl(message);

    if (whatsappWindow) {
      whatsappWindow.opener = null;
      whatsappWindow.location.href = whatsappUrl;
    } else if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    return {
      orderNumber: confirmedOrderNumber,
      status: 'pending',
    };
  };

  const notifyOrder = async (createdOrder, orderNumber) => {
    if (!createdOrder?.id) return null;

    try {
      const result = await base44.functions.invoke('send-order-confirmation', {
        orderId: createdOrder.id,
        orderNumber,
      });
      return unwrapFunctionData(result);
    } catch (notificationError) {
      console.warn('Order notifications were not sent:', notificationError?.response?.data || notificationError);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2 || submitting) return;

    if (!hasConfiguredBackend) {
      toast({
        title: 'Checkout backend is not connected',
        description: 'Connect Base44 or Supabase before accepting customer orders.',
        variant: 'destructive',
      });
      return;
    }

    if (paymentMethod === 'manual_upi' && !upiReference.trim()) {
      toast({
        title: 'Payment reference required',
        description: 'Enter the UPI transaction reference after making the payment.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      if (paymentMethod === 'razorpay') {
        const paidOrder = await completeRazorpayOrder();
        clearCart();
        const params = new URLSearchParams({
          order: paidOrder.orderNumber,
          method: 'razorpay',
          status: paidOrder.status,
        });
        navigate(`/order-success?${params.toString()}`);
        return;
      }

      if (paymentMethod === 'whatsapp_order') {
        const whatsappOrder = await completeWhatsAppOrder();
        clearCart();
        const params = new URLSearchParams({
          order: whatsappOrder.orderNumber,
          method: 'whatsapp_order',
          status: whatsappOrder.status,
        });
        navigate(`/order-success?${params.toString()}`);
        return;
      }

      const paymentDetails = paymentMethod === 'manual_upi'
        ? {
            upi_id: RAZORPAY_UPI_ID,
            transaction_reference: upiReference.trim(),
            qr_payment: true,
          }
        : null;
      const orderData = buildOrderData(paymentDetails);
      const createdOrder = await createCheckoutOrder(orderData);
      const confirmedOrderNumber = createdOrder.order_number || orderData.order_number;
      await notifyOrder(createdOrder, confirmedOrderNumber);
      clearCart();
      const params = new URLSearchParams({
        order: confirmedOrderNumber,
        method: paymentMethod,
        status: orderData.status,
      });
      navigate(`/order-success?${params.toString()}`);
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: 'Order could not be placed',
        description: getPaymentErrorMessage(error, paymentMethod),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-20 text-center min-h-screen flex items-center justify-center flex-col">
        <h2 className="font-display text-2xl text-charcoal mb-4">Your bag is empty</h2>
        <Link to="/collections"><LuxuryButton variant="secondary">Continue Shopping</LuxuryButton></Link>
      </div>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] tracking-wider uppercase text-muted-foreground mb-8">
          <Link to="/" className="hover:text-charcoal">Home</Link>
          <ChevronRight size={10} />
          <span className="text-charcoal">Checkout</span>
        </nav>

        {/* Progress */}
        <div className="flex items-center justify-center gap-8 mb-12">
          {['Shipping', 'Payment', 'Confirmation'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span className={`w-6 h-6 flex items-center justify-center text-[10px] border ${
                step > i + 1 ? 'bg-charcoal text-ivory border-charcoal' : step === i + 1 ? 'border-gold text-gold' : 'border-gold/20 text-muted-foreground'
              }`} aria-current={step === i + 1 ? 'step' : undefined}>
                {i + 1}
              </span>
              <span className={`text-[10px] tracking-[0.15em] uppercase hidden sm:inline ${step === i + 1 ? 'text-charcoal' : 'text-muted-foreground'}`}>
                {s}
              </span>
              {i < 2 && <span className="w-8 h-px needle-line hidden sm:block" />}
            </div>
          ))}
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3 space-y-8">
              {step === 1 ? (
                <>
                  {/* Shipping */}
                  <div>
                    <h2 className="font-display text-xl text-charcoal mb-6">Shipping Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Full Name" field="full_name" form={form} updateField={updateField} autoComplete="name" />
                      <InputField
                        label="Phone"
                        field="phone"
                        form={form}
                        updateField={updateField}
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        title="Enter a valid phone number with 10 to 18 characters."
                      />
                      <div className="md:col-span-2">
                        <InputField label="Email" field="email" form={form} updateField={updateField} type="email" autoComplete="email" />
                      </div>
                      <div className="md:col-span-2">
                        <InputField label="Address Line 1" field="address_line_1" form={form} updateField={updateField} autoComplete="address-line1" />
                      </div>
                      <div className="md:col-span-2">
                        <InputField label="Address Line 2" field="address_line_2" form={form} updateField={updateField} required={false} placeholder="Apartment, suite, etc." autoComplete="address-line2" />
                      </div>
                      <InputField label="City" field="city" form={form} updateField={updateField} autoComplete="address-level2" />
                      <InputField label="State" field="state" form={form} updateField={updateField} autoComplete="address-level1" />
                      <InputField
                        label="Pincode"
                        field="pincode"
                        form={form}
                        updateField={updateField}
                        autoComplete="postal-code"
                        inputMode={isIndia ? 'numeric' : 'text'}
                        pattern={isIndia ? '[0-9]{6}' : '.{3,12}'}
                        title={isIndia
                          ? 'Enter a valid 6-digit Indian pincode.'
                          : 'Enter a valid postal code with 3 to 12 characters.'}
                      />
                      <InputField label="Country" field="country" form={form} updateField={updateField} autoComplete="country-name" />
                    </div>
                  </div>

                  {/* Gift wrapping */}
                  <div className="border border-gold/10 p-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={e => setGiftWrap(e.target.checked)}
                        className="w-4 h-4 border-gold/30 accent-burgundy"
                      />
                      <div className="flex items-center gap-2">
                        <Gift size={14} className="text-gold" />
                        <span className="text-sm text-charcoal">Gift Wrapping</span>
                        <span className="text-[10px] text-muted-foreground">({formatPrice(GIFT_WRAP_COST)})</span>
                      </div>
                    </label>
                    {giftWrap && (
                      <motion.div
                        className="mt-4"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <textarea
                          value={giftMessage}
                          onChange={e => setGiftMessage(e.target.value)}
                          placeholder="Add a personal message..."
                          maxLength={300}
                          className="w-full bg-transparent border border-gold/20 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold luxury-transition h-20 resize-none"
                        />
                        <p className="mt-1 text-right text-[9px] text-muted-foreground">{giftMessage.length}/300</p>
                      </motion.div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-5 border border-gold/10 bg-beige/30 p-5">
                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-gold">Deliver to</p>
                      <p className="text-sm font-medium text-charcoal">{form.full_name}</p>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal/65">
                        {form.address_line_1}{form.address_line_2 ? `, ${form.address_line_2}` : ''}, {form.city}, {form.state} {form.pincode}
                      </p>
                      <p className="mt-1 text-xs text-charcoal/55">{form.phone} · {form.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[10px] uppercase tracking-wider text-burgundy hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Payment */}
                  <div>
                    <h2 className="font-display text-xl text-charcoal mb-6">Payment Method</h2>
                    <div className="space-y-3">
                      {[
                        ...(hasRazorpayCheckout ? [{ value: 'razorpay', label: 'Secure online payment · Razorpay' }] : []),
                        ...(isValidRazorpayUpi ? [{ value: 'manual_upi', label: 'UPI QR / UPI ID' }] : []),
                        { value: 'whatsapp_order', label: 'Order on WhatsApp' },
                      ].map(pm => (
                        <label key={pm.value} className={`flex cursor-pointer items-center gap-3 border p-4 luxury-transition ${
                          paymentMethod === pm.value ? 'border-gold bg-beige/50' : 'border-gold/10 hover:border-gold/30'
                        }`}>
                          <input
                            type="radio"
                            name="payment"
                            value={pm.value}
                            checked={paymentMethod === pm.value}
                            onChange={() => setPaymentMethod(pm.value)}
                            className="accent-burgundy"
                          />
                          <span className="text-sm text-charcoal">{pm.label}</span>
                        </label>
                      ))}
                    </div>
                    {hasRazorpayCheckout ? (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-start gap-2 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-900">
                          <Shield size={15} className="mt-0.5 shrink-0" />
                          Cards, UPI, wallets, and netbanking open securely through Razorpay.
                        </div>
                        {isRazorpayTestMode && (
                          <div className="flex items-start gap-2 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900" role="status">
                            <AlertCircle size={15} className="mt-0.5 shrink-0" />
                            Test mode cannot receive a real UPI payment. Use Razorpay test credentials, then switch to approved live keys before launch.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 flex items-start gap-2 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                        <AlertCircle size={15} className="mt-0.5 shrink-0" />
                        Online card, wallet, and UPI gateway payments need Razorpay keys before they can be accepted.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28 bg-beige/50 p-6 border border-gold/10">
                <h2 className="font-display text-xl text-charcoal mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="w-16 h-20 bg-beige shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-charcoal truncate">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.size && `Size: ${item.size}`}{item.size && item.color && ' | '}{item.color}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-charcoal">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-sm border-t border-gold/10 pt-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span></div>
                  {giftWrap && <div className="flex justify-between"><span className="text-muted-foreground">Gift Wrapping</span><span>{formatPrice(giftWrapCost)}</span></div>}
                  <div className="flex justify-between text-lg font-display pt-3 border-t border-gold/10">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {paymentMethod === 'razorpay' && (
                  <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-[11px] leading-relaxed text-emerald-950">
                    <p className="mb-2 font-semibold text-charcoal">Razorpay secure checkout</p>
                    <p>
                      Pay by card, UPI, wallet, or netbanking. Your order is marked paid only after Razorpay verification succeeds.
                    </p>
                    {isRazorpayTestMode && (
                      <p className="mt-3 border-t border-emerald-200/70 pt-3">
                        Test mode: do not scan the UPI QR with Paytm, GPay, or PhonePe. In Razorpay UPI, enter <span className="font-mono font-semibold">success@razorpay</span> to test a successful payment.
                      </p>
                    )}
                  </div>
                )}

                {paymentMethod === 'whatsapp_order' && (
                  <div className="mt-6 rounded-xl border border-forest/10 bg-emerald-50 p-4 text-[11px] leading-relaxed text-emerald-950">
                    <p className="mb-2 flex items-center gap-2 font-semibold text-charcoal">
                      <MessageCircle size={14} className="text-forest" />
                      Order on WhatsApp
                    </p>
                    <p>
                      We will open WhatsApp with your order details. Send the message there, and our team will confirm availability, measurements, payment, and delivery.
                    </p>
                  </div>
                )}

                {isValidRazorpayUpi && paymentMethod === 'manual_upi' && (
                  <>
                    <div className="bg-slate-50 border border-gold/10 rounded-xl p-4 text-[11px] text-charcoal/80 mt-6">
                      <p className="font-semibold text-charcoal mb-2">Manual UPI Payment</p>
                      <p className="mb-2">Scan this QR from your UPI app, or enter the UPI ID manually in your wallet.</p>
                      <p className="font-mono text-sm text-charcoal break-words">{RAZORPAY_UPI_ID}</p>
                    </div>
                    <div className="bg-slate-50 border border-gold/10 rounded-xl p-4 text-[11px] text-charcoal/80 mt-6">
                      <p className="font-semibold text-charcoal mb-3">Scan to Pay</p>
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={getUpiQrUrl(RAZORPAY_UPI_ID, total)}
                          alt="Scan this QR code with your UPI app"
                          className="w-52 h-52 object-contain"
                        />
                        <p className="text-[10px] text-muted-foreground text-center">
                          Pay the exact total, then enter the transaction reference below.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="upi-reference" className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-charcoal">
                        UPI transaction reference
                      </label>
                      <input
                        id="upi-reference"
                        value={upiReference}
                        onChange={(event) => setUpiReference(event.target.value)}
                        required={step === 2 && paymentMethod === 'manual_upi'}
                        minLength={6}
                        maxLength={40}
                        autoComplete="off"
                        placeholder="Enter UTR / transaction ID"
                        className="w-full border border-gold/20 bg-transparent px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none"
                      />
                      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                        Your order remains pending until this payment is verified.
                      </p>
                    </div>
                  </>
                )}

                {step === 1 ? (
                  <LuxuryButton
                    type="button"
                    variant="primary"
                    className="mt-6 w-full"
                    onClick={continueToPayment}
                  >
                    Continue to Payment
                  </LuxuryButton>
                ) : (
                  <>
                    <LuxuryButton
                      type="submit"
                      variant="primary"
                      className="mt-6 w-full"
                      disabled={submitting}
                      title={!hasConfiguredBackend ? 'Connect Base44 or Supabase before accepting customer orders.' : undefined}
                    >
                      {submitting
                        ? paymentMethod === 'razorpay' ? 'Opening Razorpay...' : paymentMethod === 'whatsapp_order' ? 'Opening WhatsApp...' : 'Placing Order...'
                        : paymentMethod === 'razorpay'
                          ? `Pay Securely · ${formatPrice(total)}`
                          : paymentMethod === 'whatsapp_order'
                          ? `Order on WhatsApp · ${formatPrice(total)}`
                          : `Submit UPI Order · ${formatPrice(total)}`}
                    </LuxuryButton>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-charcoal"
                    >
                      <ChevronLeft size={12} /> Back to shipping
                    </button>
                  </>
                )}

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Shield size={12} className="text-gold" />
                  <span className="text-[10px] text-muted-foreground tracking-wider">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
