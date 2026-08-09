import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { backendProvider, base44, hasConfiguredBackend } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/ui/AuthLayout";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { getSafeAuthRedirect, withFromUrl } from "@/lib/authRedirect";

export default function Register() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(backendProvider !== 'supabase');
  const [showOtp, setShowOtp] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const returnTo = getSafeAuthRedirect(searchParams.get("from_url"));
  const loginPath = withFromUrl("/login", returnTo);
  const isSupabase = backendProvider === 'supabase';

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

  const getAuthErrorMessage = (err, fallback) => {
    const message = err?.message || '';
    if (err?.status === 404 || message.includes('404')) {
      return 'Authentication backend is not connected yet. Add Supabase env values or run Base44 dev before creating an account.';
    }
    if (err?.code === 'provider_not_enabled' || message.includes('not turned on in Supabase')) {
      return 'Google login is not turned on yet. Please use email and password, or turn on Google in Supabase Auth > Providers.';
    }
    return message || fallback;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await base44.auth.register({ email, password });
      if (isSupabase) {
        if (result?.access_token || result?.session?.access_token) {
          window.location.href = returnTo;
          return;
        }
        setShowEmailConfirmation(true);
        return;
      }
      setShowOtp(true);
    } catch (err) {
      setError(getAuthErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      window.location.href = returnTo;
    } catch (err) {
      setError(getAuthErrorMessage(err, "Invalid verification code"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({
        title: "Code sent",
        description: "Check your email for the new code.",
      });
    } catch (err) {
      setError(getAuthErrorMessage(err, "Failed to resend code"));
    }
  };

  const handleGoogle = async () => {
    if (!hasConfiguredBackend || !googleEnabled || googleLoading) return;
    setError("");
    setGoogleLoading(true);
    try {
      await base44.auth.loginWithProvider("google", returnTo);
    } catch (err) {
      setError(getAuthErrorMessage(err, "Google login could not start"));
      if (err?.code === 'provider_not_enabled') setGoogleEnabled(false);
    } finally {
      setGoogleLoading(false);
    }
  };

  if (showEmailConfirmation) {
    return (
      <AuthLayout
        icon={Mail}
        title="Check your email"
        subtitle={`We sent a confirmation link to ${email}`}
        footer={
          <Link to={loginPath} className="text-primary font-medium hover:underline">
            Back to log in
          </Link>
        }
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm" role="alert">
            {error}
          </div>
        )}
        <p className="text-center text-sm leading-relaxed text-foreground">
          Open the confirmation link from Supabase, then return here and log in. If you disable email confirmation in Supabase Auth settings, new users will enter immediately after signup.
        </p>
        <Button
          type="button"
          className="mt-6 w-full h-12 font-medium"
          onClick={handleResend}
        >
          Resend confirmation
        </Button>
      </AuthLayout>
    );
  }

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Verify your email"
        subtitle={`We sent a code to ${email}`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm" role="alert">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-medium"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">
            Resend
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Sign up to get started"
      footer={
        <>
          Already have an account?{" "}
          <Link to={loginPath} className="text-primary font-medium hover:underline">
            Log in
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
          Google login is not turned on yet. You can create an account with email and password now.
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
          Registration needs a backend. Use <span className="font-mono">base44 dev</span>, or add Base44 env values, or add Supabase free-tier env values to <span className="font-mono">.env.local</span>.
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading || !hasConfiguredBackend}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
