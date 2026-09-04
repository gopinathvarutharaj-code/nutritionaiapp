import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider,
  getAdditionalUserInfo
} from "firebase/auth";
import { auth } from "../firebase";
import { Sparkles, Mail, Lock, User, CheckCircle, AlertCircle, HelpCircle, ExternalLink, ShieldCheck } from "lucide-react";

interface AuthPanelProps {
  onAuthSuccess: (user: { uid: string; email: string; displayName?: string }, isNewAccount?: boolean) => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  
  // Field values
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Status values
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isDomainError, setIsDomainError] = useState<boolean>(false);
  const [showDomainHelp, setShowDomainHelp] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const formatAuthError = (err: any): string => {
    const code = err?.code || "";
    const msg = err?.message || "An unexpected error occurred.";
    
    if (code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
      setIsDomainError(true);
      return `Domain unauthorized: "${window.location.hostname}" is not yet whitelisted in Firebase Console for Google OAuth.`;
    }
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      return "";
    }
    if (code === "auth/popup-blocked") {
      return "Popup blocked: Please allow popups for this site in your browser to sign in with Google, or log in with Email & Password.";
    }
    if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
      return "Incorrect email or password. Please verify your credentials.";
    }
    if (code === "auth/email-already-in-use") {
      return "This email address is already registered. Please log in instead.";
    }
    if (code === "auth/invalid-email") {
      return "Please enter a valid email address (e.g., name@gmail.com).";
    }
    if (code === "auth/weak-password") {
      return "Password must be at least 6 characters long.";
    }
    if (code === "auth/too-many-requests") {
      return "Too many attempts. Access has been temporarily paused for security. Please try again in a few moments.";
    }
    if (code === "auth/network-request-failed") {
      return "Network connection issue. Please check your internet connection.";
    }
    return msg;
  };

  const isValidEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsDomainError(false);
    setSuccess("");
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      onAuthSuccess({
        uid: userCredential.user.uid,
        email: userCredential.user.email || email.trim(),
        displayName: userCredential.user.displayName || name
      }, false);
    } catch (err: any) {
      console.warn("Firebase Login Notice:", err);
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsDomainError(false);
    setSuccess("");
    if (!email || !password || !confirmPassword || !name) {
      setError("Please complete all required fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address with a domain (e.g. name@gmail.com).");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must accept the terms & privacy policy to proceed.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      onAuthSuccess({
        uid: userCredential.user.uid,
        email: userCredential.user.email || email.trim(),
        displayName: name
      }, true);
    } catch (err: any) {
      console.warn("Firebase Sign Up Notice:", err);
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsDomainError(false);
    setSuccess("");
    if (!email) {
      setError("Please specify your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address (e.g. name@gmail.com).");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess("Reset link sent! Please check your email inbox.");
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsDomainError(false);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(userCredential);
      const isNew = additionalInfo?.isNewUser ?? false;
      onAuthSuccess({
        uid: userCredential.user.uid,
        email: userCredential.user.email || "",
        displayName: userCredential.user.displayName || ""
      }, isNew);
    } catch (err: any) {
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        console.log("[Auth] Google Sign-In popup closed by user.");
        return;
      }
      console.warn("Firebase Google Login notice: ", err);
      const formatted = formatAuthError(err);
      if (formatted) {
        setError(formatted);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center px-6 py-12 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <Sparkles className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          NutriFit <span className="text-emerald-400 font-bold">AI</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">AI-Powered Nutrition & Fitness Tracker</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md max-w-md w-full mx-auto">
        <h2 className="text-xl font-bold mb-5 text-slate-100">
          {mode === "login" && "Welcome Back!"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot" && "Reset Password"}
        </h2>

        {/* Error / Success Display */}
        {error && (
          <div className="mb-4 space-y-2">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{error}</span>
                {isDomainError && (
                  <button
                    type="button"
                    onClick={() => setShowDomainHelp(!showDomainHelp)}
                    className="mt-2 text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showDomainHelp ? "Hide Whitelist Guide" : "How to fix this in Firebase (30 seconds)"}</span>
                  </button>
                )}
              </div>
            </div>

            {isDomainError && showDomainHelp && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2.5 text-slate-300 animate-fade-in">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>How to authorize "{window.location.hostname}":</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-400 pl-1 leading-relaxed">
                  <li>Open the <strong className="text-slate-200">Firebase Console</strong> for your project (<code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">studio-8735701362-48ebd</code>).</li>
                  <li>Navigate to <strong className="text-slate-200">Build &gt; Authentication</strong> and click the <strong className="text-slate-200">Settings</strong> tab.</li>
                  <li>Click <strong className="text-slate-200">Authorized domains</strong> &gt; <strong className="text-slate-200">Add domain</strong>.</li>
                  <li>Enter <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">{window.location.hostname}</code> and click <strong className="text-slate-200">Save</strong>.</li>
                </ol>
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300 font-medium">
                  💡 <strong>Instant Alternative:</strong> You can create an account and log in using the <strong>Email & Password</strong> form above immediately without any domain configuration!
                </div>
              </div>
            )}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start space-x-2 text-xs text-emerald-400">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => setMode("forgot")} className="text-[10px] text-emerald-400 hover:underline font-bold font-sans">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl transition-all text-xs tracking-widest uppercase shadow-md shadow-emerald-500/10 mt-6 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none"
                  placeholder="Gopinath"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-1 select-none">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[10px] text-slate-400 leading-normal cursor-pointer">
                I agree to the <span className="text-emerald-400 font-semibold">Terms & Conditions</span> and <span className="text-emerald-400 font-semibold">Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl transition-all text-xs tracking-widest uppercase shadow-md shadow-emerald-500/10 mt-4 cursor-pointer"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter your registered email address, and we'll send you an encrypted password reset link immediately.
            </p>
            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-emerald-500 text-sm pl-10 pr-4 py-3.5 rounded-xl outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl transition-all text-xs tracking-widest uppercase shadow-md shadow-emerald-500/10 mt-6 cursor-pointer"
            >
              {loading ? "Sending..." : "Request Reset Code"}
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* OAuth Social Login Buttons */}
        {mode !== "forgot" && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2.5 text-slate-500 text-[10px] font-bold tracking-wider relative -top-3">Or continue with</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 hover:text-white active:scale-98 rounded-xl font-bold text-xs text-slate-200 flex items-center justify-center space-x-2.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-center mt-6 select-none">
        {mode === "login" && (
          <p className="text-xs text-slate-400">
            Don't have an account?{" "}
            <button onClick={() => setMode("signup")} className="text-emerald-400 hover:underline font-bold cursor-pointer">Sign Up</button>
          </p>
        )}
        {mode === "signup" && (
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <button onClick={() => setMode("login")} className="text-emerald-400 hover:underline font-bold cursor-pointer">Login</button>
          </p>
        )}
      </div>
    </div>
  );
};
