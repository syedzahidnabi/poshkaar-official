import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { backendProvider, base44, hasConfiguredBackend } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/ui/AuthLayout";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { getSafeAuthRedirect, withFromUrl } from "@/lib/authRedirect";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(backendProvider !== 'supabase');
  const returnTo = getSafeAuthRedirect(searchParams.get("from_url"));
  const registerPath = withFromUrl("/register", returnTo);
  const providerLabel = backendProvider === 'supabase' ? 'Supabase' : 'Base44';

  useEffect(() => {
    let isMounted = true;

    const checkGoogleProvider = async () => {
      if (!hasConfiguredBackend) {
        if (isMounted) setGoogleEnabled(false);
        return;
      }

      if (typeof base44.auth.isProviderEnabled !== 'function') {
        if (isMounted) setGoogleEnabled(true);
        return;
      }

      try {
        const enabled = await base44.auth.isProviderEnabled('google');
        if (isMounted) setGoogleEnabled(enabled);
      } catch {
        if (isMounted) setGoogleEnabled(true);
      }
    };

    checkGoogleProvider();

    return () => {
      isMounted = false;
    };
  }, []);

  const getAuthErrorMessage = (err) => {
    const message = err?.message || '';
    if (err?.status === 404 || message.includes('404')) {
      return 'Authentication backend is not connected yet. Add Supabase env values or run Base44 dev before signing in.';
    }
    if (err?.code === 'provider_not_enabled' || message.includes('not turned on in Supabase')) {
      return 'Google login is not turned on yet. Please use email and password, or turn on Google in Supabase Auth > Providers.';
    }
    return message || 'Invalid email or password';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = returnTo;
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!hasConfiguredBackend || !googleEnabled || googleLoading) return;
    setError("");
    setGoogleLoading(true);
    try {
      await base44.auth.loginWithProvider("google", returnTo);
    } catch (err) {
      setError(getAuthErrorMessage(err));
      if (err?.code === 'provider_not_enabled') setGoogleEnabled(false);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Log in to your account"
      footer={
        <>
          Don't have an account?{" "}
          <Link to={registerPath} className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
        disabled={!hasConfiguredBackend || !googleEnabled || googleLoading}
        title={!hasConfiguredBackend
          ? 'Connect Base44 or Supabase before enabling Google sign-in.'
          : !googleEnabled
            ? 'Google login is not turned on in Supabase yet.'
            : undefined}
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <GoogleIcon className="w-5 h-5 mr-2" />
        )}
        {googleLoading ? 'Opening Google...' : 'Continue with Google'}
      </Button>
      {hasConfiguredBackend && backendProvider === 'supabase' && !googleEnabled && (
        <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
          Google login is not turned on yet. You can log in with email and password now.
        </p>
      )}

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm" role="alert">
          {error}
        </div>
      )}
      {!hasConfiguredBackend && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Login needs a backend. Use <span className="font-mono">base44 dev</span>, or add Base44 env values, or add Supabase free-tier env values to <span className="font-mono">.env.local</span>.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading || !hasConfiguredBackend}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in with {providerLabel}...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
