import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, LogOut, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getSafeAuthRedirect, withFromUrl } from '@/lib/authRedirect';
import moment from 'moment';

const TABS = [
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'profile', label: 'Profile', icon: User },
];

const uniqueOrders = (...orderLists) => {
  const byId = new Map();
  orderLists.flat().forEach((order) => {
    if (order?.id) byId.set(order.id, order);
  });
  return Array.from(byId.values()).sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
};

export default function Account() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const loadAccountData = async () => {
      setLoading(true);

      if (!isAuthenticated || !user?.email) {
        if (!cancelled) {
          setOrders([]);
          setAddresses([]);
          setLoading(false);
        }
        return;
      }

      const email = user.email;
      const normalizedEmail = email.toLowerCase();
      const [ordersByCreator, ordersByEmail, userAddresses] = await Promise.all([
        base44.entities.Order.filter({ created_by: email }, '-created_date', 20).catch(() => []),
        base44.entities.Order.filter({ customer_email: normalizedEmail }, '-created_date', 20).catch(() => []),
        base44.entities.Address.filter({ created_by: email }, '-created_date', 10).catch(() => []),
      ]);

      if (!cancelled) {
        setOrders(uniqueOrders(ordersByCreator, ordersByEmail).slice(0, 20));
        setAddresses(userAddresses);
        setLoading(false);
      }
    };

    loadAccountData();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.email]);

  const handleLogout = () => logout();
  const loginPath = withFromUrl('/login', getSafeAuthRedirect(window.location.href));

  if (loading) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-gold text-[10px] tracking-[0.3em] uppercase">Your Account</span>
            <h1 className="font-display text-3xl text-charcoal font-light mt-2">
              Welcome{user?.full_name ? `, ${user.full_name}` : ''}
            </h1>
          </div>
          <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-gold hover:text-burgundy luxury-transition"
              >
                <ShieldCheck size={14} /> Admin Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-burgundy luxury-transition"
              >
                <LogOut size={14} /> Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  window.location.href = loginPath;
                }}
                className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-burgundy luxury-transition"
              >
                <User size={14} /> Sign In
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] tracking-[0.15em] uppercase luxury-transition ${
                    tab === t.key ? 'bg-beige text-charcoal border-l-2 border-gold' : 'text-muted-foreground hover:text-charcoal hover:bg-beige/50'
                  }`}
                >
                  <t.icon size={14} />
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tab === 'orders' && (
                <div>
                  <h2 className="font-display text-xl text-charcoal mb-6">Your Orders</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 bg-beige/30 border border-gold/10">
                      <Package size={32} className="text-gold/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No orders yet</p>
                      <Link to="/collections" className="text-[10px] tracking-wider uppercase text-burgundy hover:underline mt-2 inline-block">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border border-gold/10 p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-[10px] tracking-wider text-muted-foreground">Order </span>
                              <span className="text-sm text-charcoal tracking-wider">{order.order_number}</span>
                            </div>
                            <span className={`text-[10px] tracking-wider uppercase px-3 py-1 ${
                              order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                              order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                              'bg-beige text-charcoal'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{moment(order.created_date).format('DD MMM YYYY')}</span>
                            <span className="text-charcoal">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'wishlist' && (
                <div>
                  <h2 className="font-display text-xl text-charcoal mb-6">Your Wishlist</h2>
                  <div className="text-center py-12 bg-beige/30 border border-gold/10">
                    <Heart size={32} className="text-gold/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
                    <Link to="/collections" className="text-[10px] tracking-wider uppercase text-burgundy hover:underline mt-2 inline-block">
                      Discover Pieces
                    </Link>
                  </div>
                </div>
              )}

              {tab === 'addresses' && (
                <div>
                  <h2 className="font-display text-xl text-charcoal mb-6">Saved Addresses</h2>
                  {addresses.length === 0 ? (
                    <div className="text-center py-12 bg-beige/30 border border-gold/10">
                      <MapPin size={32} className="text-gold/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No saved addresses</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className="border border-gold/10 p-5">
                          <span className="text-[10px] tracking-wider uppercase text-gold">{addr.label}</span>
                          <p className="text-sm text-charcoal mt-2">{addr.full_name}</p>
                          <p className="text-sm text-muted-foreground">{addr.address_line_1}</p>
                          <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'profile' && (
                <div>
                  <h2 className="font-display text-xl text-charcoal mb-6">Profile</h2>
                  <div className="border border-gold/10 p-6 space-y-4">
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-muted-foreground">Name</span>
                      <p className="text-sm text-charcoal mt-1">{user?.full_name || 'Not added'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider uppercase text-muted-foreground">Email</span>
                      <p className="text-sm text-charcoal mt-1">{user?.email || 'Not added'}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
