import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/ui/UserNotRegisteredError';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { CartProvider } from '@/lib/CartContext';
import Navbar from '@/components/luxury/Navbar';
import Footer from '@/components/luxury/Footer';
import CartDrawer from '@/components/luxury/CartDrawer';
import LuxuryExperience from '@/components/luxury/LuxuryExperience';
import AppErrorBoundary from '@/components/ui/AppErrorBoundary';
import PageLoading from '@/components/ui/PageLoading';

// Page imports
import Home from '@/pages/Home';
const Collections = lazy(() => import('@/pages/Collections'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
const About = lazy(() => import('@/pages/About'));
const OurStory = lazy(() => import('@/pages/OurStory'));
const JournalArticle = lazy(() => import('@/pages/JournalArticle'));
const Shop = lazy(() => import('@/pages/Shop'));
const Account = lazy(() => import('@/pages/Account'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const Search = lazy(() => import('@/pages/Search'));
const AdminOrders = lazy(() => import('@/pages/AdminOrders'));
const AdminCatalog = lazy(() => import('@/pages/AdminCatalog'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const PolicyPage = lazy(() => import('@/pages/PolicyPage'));

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-ivory">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-lg tracking-[0.2em] uppercase text-charcoal">Poshkaar</p>
          <p className="text-[8px] tracking-[0.35em] uppercase text-gold mt-1">Kashmir</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 bg-charcoal px-5 py-3 text-xs uppercase tracking-[0.16em] text-ivory shadow-xl transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <CartDrawer />
      <div id="main-content" tabIndex="-1">
        <AppErrorBoundary>
          <Suspense fallback={<PageLoading />}>
            <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<Collections />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/journal/:slug" element={<JournalArticle />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/policies/:slug" element={<PolicyPage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminCatalog />} />
          <Route path="/admin/catalog" element={<AdminCatalog />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <CartProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <LuxuryExperience />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
