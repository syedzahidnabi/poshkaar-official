import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Mail,
  Package,
  RefreshCcw,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import moment from 'moment';
import { base44 } from '@/api/base44Client';
import LuxuryButton from '@/components/luxury/LuxuryButton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/AuthContext';
import { formatPrice } from '@/lib/formatPrice';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  processing: 'bg-blue-50 text-blue-800 border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  delivered: 'bg-green-50 text-green-800 border-green-200',
  cancelled: 'bg-red-50 text-red-800 border-red-200',
  returned: 'bg-stone-100 text-stone-700 border-stone-200',
  paid: 'bg-green-50 text-green-800 border-green-200',
  failed: 'bg-red-50 text-red-800 border-red-200',
  refunded: 'bg-purple-50 text-purple-800 border-purple-200',
  sent: 'bg-green-50 text-green-800 border-green-200',
  not_sent: 'bg-stone-100 text-stone-700 border-stone-200',
};

const PAYMENT_LABELS = {
  cod: 'Legacy Offline Order',
  whatsapp_order: 'WhatsApp Order',
  manual_upi: 'Manual UPI',
  razorpay: 'Razorpay',
};

const defaultDraft = {
  tracking_number: '',
  estimated_delivery: '',
  notes: '',
};

const normalize = (value) => String(value || '').toLowerCase();

const titleCase = (value) =>
  String(value || 'not set')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getCustomerName = (order) =>
  order.customer_name || order.shipping_address?.full_name || 'Guest customer';

const getCustomerEmail = (order) =>
  order.customer_email || order.shipping_address?.email || order.created_by || '';

const getCustomerPhone = (order) =>
  order.customer_phone || order.shipping_address?.phone || '';

const getOrderDraft = (drafts, order) => ({
  tracking_number: order.tracking_number || '',
  estimated_delivery: order.estimated_delivery || '',
  notes: order.notes || '',
  ...(drafts[order.id] || {}),
});

const getAddressLines = (address = {}) => [
  address.address_line_1,
  address.address_line_2,
  [address.city, address.state, address.pincode].filter(Boolean).join(', '),
  address.country,
].filter(Boolean);

const getSearchText = (order) => [
  order.order_number,
  getCustomerName(order),
  getCustomerEmail(order),
  getCustomerPhone(order),
  order.status,
  order.payment_status,
  order.payment_method,
  order.tracking_number,
  ...(order.items || []).map((item) => item.title),
].map(normalize).join(' ');

const sortOrders = (orders) =>
  [...orders].sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));

const applyOrderEvent = (orders, event) => {
  if (!event?.id) return orders;

  if (event.type === 'delete') {
    return orders.filter((order) => order.id !== event.id);
  }

  const incoming = { id: event.id, ...(event.data || {}) };
  const exists = orders.some((order) => order.id === event.id);
  if (exists) {
    return sortOrders(orders.map((order) => (order.id === event.id ? { ...order, ...incoming } : order)));
  }

  return sortOrders([incoming, ...orders]);
};

function StatusPill({ value, fallback = 'not_sent' }) {
  const safeValue = value || fallback;
  const className = STATUS_STYLES[safeValue] || STATUS_STYLES.pending;

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.12em] ${className}`}>
      {titleCase(safeValue)}
    </span>
  );
}

function NotificationPill({ label, sent }) {
  const className = sent ? STATUS_STYLES.sent : STATUS_STYLES.not_sent;

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.12em] ${className}`}>
      <span className="mr-1 opacity-70">{label}:</span>
      {sent ? 'Sent' : 'Not sent'}
    </span>
  );
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="border border-gold/10 bg-beige/30 p-5 shadow-3d">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        <Icon size={16} className="text-gold" />
      </div>
      <p className="font-display text-2xl font-light text-charcoal">{value}</p>
    </div>
  );
}

function AdminGate({ isAuthenticated, onLogin }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 pt-28 pb-20">
      <div className="max-w-md border border-gold/10 bg-beige/30 p-8 text-center shadow-3d">
        <ShieldCheck size={34} className="mx-auto mb-4 text-gold" />
        <span className="text-[10px] uppercase tracking-[0.28em] text-gold">Admin Area</span>
        <h1 className="mt-3 font-display text-3xl font-light text-charcoal">Order management is protected</h1>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/65">
          Only Poshkaar admin users can view all orders, update statuses, and resend order emails.
        </p>
        <div className="mt-7">
          {isAuthenticated ? (
            <Link to="/account">
              <LuxuryButton variant="secondary">Back to Account</LuxuryButton>
            </Link>
          ) : (
            <LuxuryButton variant="primary" onClick={onLogin}>Sign In</LuxuryButton>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AdminOrders() {
  const { user, isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [updatingId, setUpdatingId] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    let unsubscribe;

    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const latestOrders = await base44.entities.Order.list('-created_date', 200);
        if (!cancelled) {
          setOrders(sortOrders(latestOrders));
        }
      } catch (loadError) {
        console.error('Unable to load admin orders:', loadError);
        if (!cancelled) {
          setError(
            loadError?.isMissingSupabaseSchema
              ? loadError.message
              : 'Unable to load orders. Confirm the Order entity permissions allow admin read access.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrders();

    try {
      unsubscribe = base44.entities.Order.subscribe((event) => {
        setOrders((currentOrders) => applyOrderEvent(currentOrders, event));
      });
    } catch (subscribeError) {
      console.warn('Realtime order updates are unavailable:', subscribeError);
    }

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isAdmin]);

  const metrics = useMemo(() => {
    const pendingPayments = orders.filter((order) => order.payment_status === 'pending').length;
    const activeOrders = orders.filter((order) => !['delivered', 'cancelled', 'returned'].includes(order.status)).length;
    const revenue = orders.reduce((sum, order) => {
      if (order.status === 'cancelled' || order.payment_status === 'refunded') return sum;
      return sum + (Number(order.total) || 0);
    }, 0);

    return {
      totalOrders: orders.length,
      activeOrders,
      pendingPayments,
      revenue,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const search = normalize(searchTerm.trim());

    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
      const matchesSearch = !search || getSearchText(order).includes(search);
      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, paymentFilter, searchTerm, statusFilter]);

  const updateOrder = async (order, updates, successMessage) => {
    if (!order?.id) return;

    const updateKey = `${order.id}:${Object.keys(updates).join(',')}`;
    setUpdatingId(updateKey);

    try {
      const updatedOrder = await base44.entities.Order.update(order.id, updates);
      setOrders((currentOrders) => sortOrders(currentOrders.map((currentOrder) => (
        currentOrder.id === order.id ? { ...currentOrder, ...updates, ...updatedOrder } : currentOrder
      ))));
      toast({
        title: 'Order updated',
        description: successMessage || `${order.order_number || 'Order'} has been updated.`,
      });
    } catch (updateError) {
      console.error('Order update failed:', updateError);
      toast({
        title: 'Order update failed',
        description: updateError?.response?.data?.error || 'Please check your admin permissions and try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId('');
    }
  };

  const updateDraft = (orderId, field, value) => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [orderId]: {
        ...defaultDraft,
        ...(currentDrafts[orderId] || {}),
        [field]: value,
      },
    }));
  };

  const saveOrderDetails = async (order) => {
    const draft = getOrderDraft(drafts, order);
    await updateOrder(order, {
      tracking_number: draft.tracking_number.trim(),
      estimated_delivery: draft.estimated_delivery.trim(),
      notes: draft.notes.trim(),
    }, 'Tracking and internal notes were saved.');
  };

  const resendConfirmation = async (order) => {
    if (!order?.id) return;

    const updateKey = `${order.id}:email`;
    setUpdatingId(updateKey);

    try {
      const response = await base44.functions.invoke('send-order-confirmation', {
        orderId: order.id,
        orderNumber: order.order_number,
        force: true,
      });
      const result = response?.data || {};
      const sentAt = result.sentAt || new Date().toISOString();
      const customerDone = Boolean(result.customerNotified || result.alreadySent?.customer || order.confirmation_email_sent_at);
      const adminDone = Boolean(result.adminNotified || result.alreadySent?.admin || order.admin_notification_sent_at);
      const ownerWhatsappDone = Boolean(
        result.ownerWhatsappNotified
        || result.whatsappNotified
        || result.alreadySent?.ownerWhatsapp
        || order.owner_whatsapp_notification_sent_at
        || order.whatsapp_notification_sent_at
      );
      const customerWhatsappDone = Boolean(
        result.customerWhatsappNotified
        || result.alreadySent?.customerWhatsapp
        || order.customer_whatsapp_notification_sent_at
      );
      const ownerWhatsappText = result.whatsappConfigured ? (ownerWhatsappDone ? 'sent' : 'not sent') : 'not connected';
      const customerWhatsappText = result.whatsappConfigured ? (customerWhatsappDone ? 'sent' : 'not sent') : 'not connected';

      setOrders((currentOrders) => currentOrders.map((currentOrder) => (
        currentOrder.id === order.id ? {
          ...currentOrder,
          ...(result.customerNotified ? { confirmation_email_sent_at: sentAt } : {}),
          ...(result.adminNotified ? { admin_notification_sent_at: sentAt } : {}),
          ...(result.ownerWhatsappNotified || result.whatsappNotified ? {
            whatsapp_notification_sent_at: sentAt,
            owner_whatsapp_notification_sent_at: sentAt,
          } : {}),
          ...(result.customerWhatsappNotified ? { customer_whatsapp_notification_sent_at: sentAt } : {}),
        } : currentOrder
      )));
      toast({
        title: result.customerNotified || result.adminNotified || result.whatsappNotified
          ? 'Notifications sent'
          : 'Notification check complete',
        description: `Customer email: ${customerDone ? 'sent' : 'not sent'} | Owner email: ${adminDone ? 'sent' : 'not sent'} | Owner WhatsApp: ${ownerWhatsappText} | Customer WhatsApp: ${customerWhatsappText}`,
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError);
      toast({
        title: 'Email could not be sent',
        description: emailError?.response?.data?.error || 'Deploy the send-order-confirmation function and try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId('');
    }
  };

  if (isLoadingAuth || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-28 pb-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.24em] text-charcoal">Loading orders</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return <AdminGate isAuthenticated={isAuthenticated} onLogin={navigateToLogin} />;
  }

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold">Admin Dashboard</span>
            <h1 className="mt-3 font-display text-4xl font-light text-charcoal">Order Management</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/65">
              Review every customer order, update fulfilment and payment status, save tracking notes, and resend confirmation emails.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin/catalog" className="border border-gold/25 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-charcoal hover:border-gold">
              Manage Catalogue
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-burgundy luxury-transition"
            >
              <RefreshCcw size={14} /> Refresh
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total orders" value={metrics.totalOrders} icon={ClipboardList} />
          <MetricCard label="Active fulfilment" value={metrics.activeOrders} icon={Package} />
          <MetricCard label="Pending payments" value={metrics.pendingPayments} icon={AlertCircle} />
          <MetricCard label="Order value" value={formatPrice(metrics.revenue)} icon={CheckCircle2} />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 border border-gold/10 bg-beige/20 p-5 lg:grid-cols-[1fr_220px_220px]">
          <label className="relative block">
            <span className="sr-only">Search orders</span>
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by order, customer, email, phone, product, tracking..."
              className="w-full border border-gold/20 bg-ivory/80 py-3 pl-11 pr-4 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-gold focus:outline-none"
            />
          </label>

          <label>
            <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Order status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full border border-gold/20 bg-ivory/80 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none"
            >
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>{titleCase(status)}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Payment</span>
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="w-full border border-gold/20 bg-ivory/80 px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none"
            >
              <option value="all">All payments</option>
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>{titleCase(status)}</option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <div className="mb-8 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="border border-gold/10 bg-beige/30 px-6 py-16 text-center">
            <Package size={34} className="mx-auto mb-4 text-gold/40" />
            <p className="font-display text-2xl font-light text-charcoal">No matching orders</p>
            <p className="mt-2 text-sm text-muted-foreground">Try clearing the search or filters.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const draft = getOrderDraft(drafts, order);
              const customerEmailSent = Boolean(order.confirmation_email_sent_at);
              const adminEmailSent = Boolean(order.admin_notification_sent_at);
              const ownerWhatsappSent = Boolean(order.owner_whatsapp_notification_sent_at || order.whatsapp_notification_sent_at);
              const customerWhatsappSent = Boolean(order.customer_whatsapp_notification_sent_at);
              const emailUpdateKey = `${order.id}:email`;
              const detailsUpdateKey = `${order.id}:tracking_number,estimated_delivery,notes`;

              return (
                <motion.article
                  key={order.id}
                  layout
                  className="overflow-hidden border border-gold/10 bg-ivory shadow-3d"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="grid grid-cols-1 gap-5 border-b border-gold/10 bg-beige/20 p-5 xl:grid-cols-[1.2fr_1fr_auto] xl:items-center">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Order</span>
                        <span className="font-display text-xl text-charcoal">{order.order_number || order.id}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.created_date ? moment(order.created_date).format('DD MMM YYYY, h:mm A') : 'Date unavailable'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Customer</span>
                        <p className="mt-1 text-charcoal">{getCustomerName(order)}</p>
                        <p className="mt-0.5 break-words text-xs text-charcoal/55">{getCustomerEmail(order) || 'No email'}</p>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Total</span>
                        <p className="mt-1 font-display text-xl text-charcoal">{formatPrice(order.total || 0)}</p>
                        <p className="mt-0.5 text-xs text-charcoal/55">{PAYMENT_LABELS[order.payment_method] || titleCase(order.payment_method)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 xl:justify-end">
                      <StatusPill value={order.status} />
                      <StatusPill value={order.payment_status} />
                      <NotificationPill label="Customer email" sent={customerEmailSent} />
                      <NotificationPill label="Owner email" sent={adminEmailSent} />
                      <NotificationPill label="Owner WhatsApp" sent={ownerWhatsappSent} />
                      <NotificationPill label="Customer WhatsApp" sent={customerWhatsappSent} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-[220px_220px_1fr_auto] lg:items-end">
                    <label>
                      <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Order status</span>
                      <select
                        value={order.status || 'pending'}
                        onChange={(event) => updateOrder(order, { status: event.target.value }, `Order status changed to ${titleCase(event.target.value)}.`)}
                        disabled={updatingId.startsWith(`${order.id}:status`)}
                        className="w-full border border-gold/20 bg-transparent px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none disabled:opacity-50"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{titleCase(status)}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Payment status</span>
                      <select
                        value={order.payment_status || 'pending'}
                        onChange={(event) => updateOrder(order, { payment_status: event.target.value }, `Payment status changed to ${titleCase(event.target.value)}.`)}
                        disabled={updatingId.startsWith(`${order.id}:payment_status`)}
                        className="w-full border border-gold/20 bg-transparent px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none disabled:opacity-50"
                      >
                        {PAYMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>{titleCase(status)}</option>
                        ))}
                      </select>
                    </label>

                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                      <div className="border border-gold/10 bg-beige/20 p-3">
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Items</span>
                        <p className="mt-1 text-charcoal">{(order.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)} pcs</p>
                      </div>
                      <div className="border border-gold/10 bg-beige/20 p-3">
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Phone</span>
                        <p className="mt-1 text-charcoal">{getCustomerPhone(order) || 'Not added'}</p>
                      </div>
                      <div className="border border-gold/10 bg-beige/20 p-3">
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Tracking</span>
                        <p className="mt-1 truncate text-charcoal">{order.tracking_number || 'Not added'}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="min-h-11 px-4 text-[10px] uppercase tracking-[0.16em] text-burgundy hover:underline"
                    >
                      {isExpanded ? 'Hide details' : 'View details'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-6 border-t border-gold/10 bg-beige/10 p-5 lg:grid-cols-2">
                      <section>
                        <h2 className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-charcoal">
                          <Package size={14} className="text-gold" /> Order items
                        </h2>
                        <div className="space-y-3">
                          {(order.items || []).map((item, index) => (
                            <div key={`${item.product_id || item.title}-${index}`} className="flex gap-3 border border-gold/10 bg-ivory p-3">
                              {item.image && (
                                <img src={item.image} alt={item.title || 'Order item'} className="h-20 w-16 object-cover" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-charcoal">{item.title || 'Untitled item'}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Qty {item.quantity || 1}
                                  {item.size ? ` · Size ${item.size}` : ''}
                                  {item.color ? ` · ${item.color}` : ''}
                                </p>
                                <p className="mt-2 text-sm text-charcoal">{formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 1))}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 space-y-2 border border-gold/10 bg-ivory p-4 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal || 0)}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{Number(order.shipping) ? formatPrice(order.shipping) : 'Complimentary'}</span></div>
                          {order.gift_wrapping && <div className="flex justify-between"><span className="text-muted-foreground">Gift wrapping</span><span>Yes</span></div>}
                          <div className="flex justify-between border-t border-gold/10 pt-2 font-display text-lg"><span>Total</span><span>{formatPrice(order.total || 0)}</span></div>
                        </div>
                      </section>

                      <section>
                        <h2 className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-charcoal">
                          <Truck size={14} className="text-gold" /> Fulfilment
                        </h2>

                        <div className="mb-5 border border-gold/10 bg-ivory p-4 text-sm">
                          <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Shipping address</span>
                          <p className="font-medium text-charcoal">{order.shipping_address?.full_name || getCustomerName(order)}</p>
                          {getAddressLines(order.shipping_address).map((line) => (
                            <p key={line} className="mt-1 text-charcoal/65">{line}</p>
                          ))}
                          <p className="mt-3 text-charcoal/65">{getCustomerPhone(order)}</p>
                          <p className="text-charcoal/65">{getCustomerEmail(order)}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <label>
                            <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Tracking number</span>
                            <input
                              value={draft.tracking_number}
                              onChange={(event) => updateDraft(order.id, 'tracking_number', event.target.value)}
                              className="w-full border border-gold/20 bg-ivory px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none"
                              placeholder="Courier tracking ID"
                            />
                          </label>
                          <label>
                            <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Estimated delivery</span>
                            <input
                              value={draft.estimated_delivery}
                              onChange={(event) => updateDraft(order.id, 'estimated_delivery', event.target.value)}
                              className="w-full border border-gold/20 bg-ivory px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none"
                              placeholder="e.g. 5-7 business days"
                            />
                          </label>
                        </div>

                        <label className="mt-4 block">
                          <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Internal notes</span>
                          <textarea
                            value={draft.notes}
                            onChange={(event) => updateDraft(order.id, 'notes', event.target.value)}
                            className="h-28 w-full resize-none border border-gold/20 bg-ivory px-4 py-3 text-sm text-charcoal focus:border-gold focus:outline-none"
                            placeholder="Admin-only fulfilment notes"
                          />
                        </label>

                        {order.payment_details?.transaction_reference && (
                          <div className="mt-4 border border-gold/10 bg-ivory p-4 text-sm">
                            <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">UPI reference</span>
                            <p className="mt-1 font-mono text-charcoal">{order.payment_details.transaction_reference}</p>
                          </div>
                        )}

                        {order.gift_message && (
                          <div className="mt-4 border border-gold/10 bg-ivory p-4 text-sm">
                            <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Gift message</span>
                            <p className="mt-1 text-charcoal/70">{order.gift_message}</p>
                          </div>
                        )}

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <LuxuryButton
                            variant="primary"
                            onClick={() => saveOrderDetails(order)}
                            disabled={updatingId === detailsUpdateKey}
                          >
                            {updatingId === detailsUpdateKey ? 'Saving...' : 'Save Details'}
                          </LuxuryButton>
                          <LuxuryButton
                            variant="secondary"
                            onClick={() => resendConfirmation(order)}
                            disabled={updatingId === emailUpdateKey || !getCustomerEmail(order)}
                          >
                            <Mail size={13} /> {updatingId === emailUpdateKey ? 'Sending...' : 'Send Notifications'}
                          </LuxuryButton>
                        </div>
                      </section>
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
