import { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight,
  Smartphone, ArrowLeft, Timer, RefreshCw, ShieldCheck,
  Truck, Headphones, Star, Sparkles, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Mode = "login" | "register" | "otp";

export default function AuthPage() {
  const { user, loading, signIn, sendOTP, verifyLoginOTP, verifySignupOTP } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);

  const [form, setForm] = useState({
    fullName: "", username: "", email: "", mobilenumber: "", password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [otpSending, setOtpSending] = useState(false);

  const [otpLoginStep, setOtpLoginStep] = useState<"phone" | "verify">("phone");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [signupStep, setSignupStep] = useState<"form" | "verify">("form");
  const [signupOtpCode, setSignupOtpCode] = useState("");

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /* ── Password Login ── */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Signup: send OTP ── */
  const handleSignupSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mobilenumber.trim()) { toast.error("Enter your mobile number"); return; }
    setSubmitting(true);
    try {
      await sendOTP(form.mobilenumber.trim(), "signup");
      toast.success("OTP sent to your phone!");
      setSignupStep("verify");
      setCountdown(60);
      setSignupOtpCode("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Signup: verify OTP ── */
  const handleVerifySignupOTP = async () => {
    if (signupOtpCode.length !== 6) { toast.error("Enter the complete 6-digit OTP"); return; }
    setSubmitting(true);
    try {
      await verifySignupOTP({
        phone: form.mobilenumber.trim(),
        code: signupOtpCode,
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success("Account created! Welcome to Kaizen!");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Signup: resend OTP ── */
  const handleResendSignupOTP = async () => {
    if (countdown > 0) return;
    setOtpSending(true);
    try {
      await sendOTP(form.mobilenumber.trim(), "signup");
      toast.success("OTP resent!");
      setCountdown(60);
      setSignupOtpCode("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setOtpSending(false);
    }
  };

  /* ── OTP Login: send OTP ── */
  const handleSendLoginOTP = async () => {
    if (!otpPhone.trim()) { toast.error("Enter your phone number"); return; }
    setOtpSending(true);
    try {
      await sendOTP(otpPhone.trim(), "login");
      toast.success("OTP sent to your phone!");
      setOtpLoginStep("verify");
      setCountdown(60);
      setOtpCode("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  /* ── OTP Login: verify OTP ── */
  const handleVerifyLoginOTP = async () => {
    if (otpCode.length !== 6) { toast.error("Enter the complete 6-digit OTP"); return; }
    setSubmitting(true);
    try {
      await verifyLoginOTP(otpPhone.trim(), otpCode);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── OTP Login: resend OTP ── */
  const handleResendLoginOTP = async () => {
    if (countdown > 0) return;
    setOtpSending(true);
    try {
      await sendOTP(otpPhone.trim(), "login");
      toast.success("OTP resent!");
      setCountdown(60);
      setOtpCode("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setOtpSending(false);
    }
  };

  /* ── Switch mode ── */
  const switchMode = (m: Mode) => {
    setMode(m);
    setShowPass(false);
    setOtpLoginStep("phone");
    setSignupStep("form");
    setOtpPhone("");
    setOtpCode("");
    setSignupOtpCode("");
    setCountdown(0);
    setForm({ fullName: "", username: "", email: "", mobilenumber: "", password: "" });
  };

  /* ── Password strength ── */
  const pwStrength = (() => {
    const p = form.password;
    if (!p) return { level: 0, label: "", color: "" };
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^a-zA-Z\d]/.test(p)) s++;
    return [
      { level: 0, label: "", color: "" },
      { level: 1, label: "Weak", color: "bg-red-500" },
      { level: 2, label: "Fair", color: "bg-yellow-400" },
      { level: 3, label: "Good", color: "bg-blue-500" },
      { level: 4, label: "Strong", color: "bg-green-500" },
    ][s];
  })();

  const inVerifyStep =
    (mode === "register" && signupStep === "verify") ||
    (mode === "otp" && otpLoginStep === "verify");

  return (
    <div className="flex min-h-[calc(100vh-130px)] bg-[#F5F5F5]">

      {/* ── LEFT — Brand Panel (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-[44%] relative flex-col justify-between p-14 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #FF6E31 0%, #E55F20 45%, #111111 100%)" }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 opacity-20"
          style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 opacity-20"
          style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-block bg-white p-2.5">
            <img
              src="/kaizenlogo.png"
              alt="Kaizen Art & Craft"
              className="h-24 w-auto object-contain"
              draggable={false}
            />
          </Link>
        </div>

        {/* Headline + features */}
        <div className="relative z-10 space-y-10">
          <div>
            <h2 className="text-[2.6rem] font-black text-white leading-[1.15]">
              Craft Your<br />
              <span className="text-white/80">Perfect</span> Home.
            </h2>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-xs">
              Authentic handcrafted art from skilled Indian artisans.
              Tradition built to last generations.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              { icon: ShieldCheck, label: "100% Authentic Handcraft" },
              { icon: Truck,        label: "Free Delivery Across India" },
              { icon: Sparkles,     label: "Curated Artisan Collections" },
              { icon: Headphones,   label: "Dedicated Customer Support" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3.5">
                <div className="w-9 h-9 bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <span className="text-white/75 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="bg-white/10 border border-white/10 p-5">
            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={13} className="fill-white text-white" />
              ))}
            </div>
            <p className="text-white/80 text-sm italic leading-relaxed">
              "The quality of Kaizen handcraft is exceptional. My living room looks absolutely stunning!"
            </p>
            <p className="text-white/60 text-xs font-bold mt-3">— Priya S., Mumbai</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT — Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 py-10 overflow-y-auto bg-white">
        <div className="w-full max-w-[420px]">

          {/* Mobile-only logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="inline-block">
              <img
                src="/kaizenlogo.png"
                alt="Kaizen Art & Craft"
                className="h-20 w-auto object-contain"
                draggable={false}
              />
            </Link>
          </div>

          {/* ── Mode Tabs ── */}
          {!inVerifyStep && (
            <div className="flex bg-[#F5F5F5] p-1 mb-8 border border-[#EEEEEE]">
              {(["login", "register", "otp"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 text-[11px] font-bold tracking-wide uppercase transition-all duration-200 ${
                    mode === m
                      ? "bg-[#FF6E31] text-white shadow-sm"
                      : "text-[#555555] hover:bg-[#EEEEEE] hover:text-[#111111]"
                  }`}
                >
                  {m === "login" ? "Sign In" : m === "register" ? "Register" : "OTP Login"}
                </button>
              ))}
            </div>
          )}

          {/* ── SIGN IN ── */}
          {mode === "login" && (
            <div>
              <div className="mb-7">
                <h1 className="text-3xl font-black text-[#111111]">Welcome Back</h1>
                <p className="text-[#555555] text-sm mt-1">Sign in to continue your shopping</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <AuthInput
                  icon={Mail} name="email" type="email"
                  placeholder="Email address"
                  value={form.email} onChange={handleChange}
                />

                <div className="relative">
                  <AuthInput
                    icon={Lock} name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={form.password} onChange={handleChange}
                  />
                  <EyeToggle show={showPass} onToggle={() => setShowPass((s) => !s)} />
                </div>

                <div className="flex justify-end -mt-1">
                  <button type="button" className="text-xs text-[#FF6E31] hover:underline font-semibold">
                    Forgot password?
                  </button>
                </div>

                <PrimaryBtn loading={submitting} loadingLabel="Signing in…">
                  Sign In
                </PrimaryBtn>
              </form>

              <Divider />

              <div className="space-y-3">
                <OutlineBtn
                  onClick={() => switchMode("otp")}
                  icon={<Smartphone size={16} className="text-[#FF6E31]" />}
                >
                  Login with OTP instead
                </OutlineBtn>
                <OutlineBtn onClick={() => switchMode("register")}>
                  Don't have an account?{" "}
                  <span className="text-[#FF6E31] font-bold ml-1">Register</span>
                </OutlineBtn>
              </div>
            </div>
          )}

          {/* ── REGISTER — Form ── */}
          {mode === "register" && signupStep === "form" && (
            <div>
              <div className="mb-7">
                <h1 className="text-3xl font-black text-[#111111]">Create Account</h1>
                <p className="text-[#555555] text-sm mt-1">
                  Join Kaizen for exclusive handcraft deals
                </p>
                <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-[#FFF4EE] text-xs font-bold text-[#FF6E31] border border-[#FF6E31]/20">
                  <Sparkles size={12} />
                  10% off on your first order
                </span>
              </div>

              <form onSubmit={handleSignupSendOTP} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <AuthInput icon={User} name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
                  <AuthInput icon={User} name="username" placeholder="Username" value={form.username} onChange={handleChange} />
                </div>
                <AuthInput icon={Mail} name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} />
                <AuthInput icon={Phone} name="mobilenumber" type="tel" placeholder="Mobile number (+91…)" value={form.mobilenumber} onChange={handleChange} />

                <div className="relative">
                  <AuthInput
                    icon={Lock} name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password} onChange={handleChange}
                    onFocus={() => setPwFocus(true)}
                    onBlur={() => setPwFocus(false)}
                  />
                  <EyeToggle show={showPass} onToggle={() => setShowPass((s) => !s)} />
                </div>

                {/* Password strength */}
                {form.password && pwFocus && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((l) => (
                        <div
                          key={l}
                          className={`h-1.5 flex-1 transition-all duration-300 ${
                            l <= pwStrength.level ? pwStrength.color : "bg-[#EEEEEE]"
                          }`}
                        />
                      ))}
                    </div>
                    {pwStrength.label && (
                      <p className="text-xs text-[#555555]">
                        Strength:{" "}
                        <span className="font-bold text-[#111111]">{pwStrength.label}</span>
                      </p>
                    )}
                  </div>
                )}

                <PrimaryBtn loading={submitting} loadingLabel="Sending OTP…">
                  Continue <ArrowRight size={16} />
                </PrimaryBtn>
              </form>

              <p className="text-[11px] text-center text-[#999999] mt-5">
                By registering, you agree to our{" "}
                <a href="/terms" className="text-[#FF6E31] hover:underline">Terms</a>
                {" "}and{" "}
                <a href="/privacy" className="text-[#FF6E31] hover:underline">Privacy Policy</a>
              </p>
            </div>
          )}

          {/* ── REGISTER — OTP Verify ── */}
          {mode === "register" && signupStep === "verify" && (
            <OtpVerifyCard
              title="Verify Your Phone"
              subtitle="We sent a 6-digit code to"
              target={form.mobilenumber}
              onChangeTarget={() => { setSignupStep("form"); setSignupOtpCode(""); }}
              changeLabel="Edit details"
              code={signupOtpCode}
              setCode={setSignupOtpCode}
              countdown={countdown}
              onResend={handleResendSignupOTP}
              resending={otpSending}
              onVerify={handleVerifySignupOTP}
              verifying={submitting}
              verifyLabel="Create Account"
              onBack={() => { setSignupStep("form"); setSignupOtpCode(""); setCountdown(0); }}
            />
          )}

          {/* ── OTP LOGIN — Phone Input ── */}
          {mode === "otp" && otpLoginStep === "phone" && (
            <div>
              <div className="mb-7">
                <h1 className="text-3xl font-black text-[#111111]">OTP Login</h1>
                <p className="text-[#555555] text-sm mt-1">Enter your registered phone number</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999] group-focus-within:text-[#FF6E31] transition-colors" />
                  <input
                    type="tel"
                    placeholder="Phone number (+91…)"
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendLoginOTP()}
                    className="w-full bg-white border border-[#EEEEEE] pl-12 pr-4 py-3.5 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#FF6E31] focus:ring-1 focus:ring-[#FF6E31] transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendLoginOTP}
                  disabled={otpSending}
                  className="w-full bg-[#FF6E31] hover:bg-[#E55F20] text-white py-4 font-bold text-sm tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {otpSending ? (
                    <>
                      <Spinner />
                      Sending OTP…
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              <Divider />
              <OutlineBtn onClick={() => switchMode("login")} icon={<ArrowLeft size={15} />}>
                Back to password login
              </OutlineBtn>
            </div>
          )}

          {/* ── OTP LOGIN — Verify ── */}
          {mode === "otp" && otpLoginStep === "verify" && (
            <OtpVerifyCard
              title="Enter OTP"
              subtitle="We sent a 6-digit code to"
              target={otpPhone}
              onChangeTarget={() => { setOtpLoginStep("phone"); setOtpCode(""); }}
              changeLabel="Change number"
              code={otpCode}
              setCode={setOtpCode}
              countdown={countdown}
              onResend={handleResendLoginOTP}
              resending={otpSending}
              onVerify={handleVerifyLoginOTP}
              verifying={submitting}
              verifyLabel="Sign In"
              onBack={() => { setOtpLoginStep("phone"); setOtpCode(""); }}
            />
          )}

        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
══════════════════════════════════════════════════════════ */

interface AuthInputProps {
  icon: React.ElementType;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

function AuthInput({ icon: Icon, name, type = "text", placeholder, value, onChange, onFocus, onBlur }: AuthInputProps) {
  return (
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999] group-focus-within:text-[#FF6E31] transition-colors duration-200" />
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required
        className="w-full bg-white border border-[#EEEEEE] pl-12 pr-4 py-3.5 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#FF6E31] focus:ring-1 focus:ring-[#FF6E31] transition-all duration-200"
      />
    </div>
  );
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#FF6E31] transition-colors"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

function PrimaryBtn({
  children, loading, loadingLabel, onClick,
}: {
  children: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={loading}
      className="w-full bg-[#FF6E31] hover:bg-[#E55F20] text-white py-4 font-bold text-sm tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Spinner />
          {loadingLabel ?? "Please wait…"}
        </>
      ) : (
        children
      )}
    </button>
  );
}

function OutlineBtn({
  children, onClick, icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-white border border-[#EEEEEE] py-3.5 text-sm font-semibold text-[#111111] hover:border-[#FF6E31] hover:bg-[#FFF4EE] transition-all duration-200 flex items-center justify-center gap-2"
    >
      {icon}
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#EEEEEE]" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 bg-white text-[#999999] text-xs font-medium">OR</span>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );
}

interface OtpVerifyCardProps {
  title: string;
  subtitle: string;
  target: string;
  onChangeTarget: () => void;
  changeLabel: string;
  code: string;
  setCode: (v: string) => void;
  countdown: number;
  onResend: () => void;
  resending: boolean;
  onVerify: () => void;
  verifying: boolean;
  verifyLabel: string;
  onBack: () => void;
}

function OtpVerifyCard({
  title, subtitle, target, onChangeTarget, changeLabel,
  code, setCode, countdown, onResend, resending,
  onVerify, verifying, verifyLabel, onBack,
}: OtpVerifyCardProps) {
  return (
    <div className="space-y-7">

      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-5 bg-[#FFF4EE] border border-[#FF6E31]/20 flex items-center justify-center">
          <CheckCircle2 size={30} className="text-[#FF6E31]" />
        </div>
        <h1 className="text-2xl font-black text-[#111111]">{title}</h1>
        <p className="text-[#555555] text-sm mt-1">
          {subtitle}{" "}
          <span className="font-bold text-[#111111]">{target}</span>
        </p>
        <button
          type="button"
          onClick={onChangeTarget}
          className="text-xs text-[#FF6E31] hover:underline font-semibold mt-1 block mx-auto"
        >
          {changeLabel}
        </button>
      </div>

      <div>
        <p className="text-xs text-center text-[#999999] mb-4 font-medium">ENTER 6-DIGIT CODE</p>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-14 text-xl font-black border border-[#EEEEEE] bg-white text-[#111111] data-[active=true]:border-[#FF6E31] data-[active=true]:ring-1 data-[active=true]:ring-[#FF6E31] transition-all"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        {countdown > 0 ? (
          <span className="flex items-center gap-1.5 text-[#555555]">
            <Timer size={15} />
            Resend in{" "}
            <span className="font-bold text-[#FF6E31] tabular-nums w-7 text-center">
              {countdown}s
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={resending}
            className="flex items-center gap-1.5 text-[#FF6E31] hover:underline font-semibold disabled:opacity-50"
          >
            <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
            Resend OTP
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onVerify}
        disabled={verifying || code.length !== 6}
        className="w-full bg-[#FF6E31] hover:bg-[#E55F20] text-white py-4 font-bold text-sm tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {verifying ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying…
          </>
        ) : (
          <>
            {verifyLabel}
            <ArrowRight size={16} />
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 text-sm text-[#555555] hover:text-[#FF6E31] transition-colors font-medium"
      >
        <ArrowLeft size={14} />
        Go back
      </button>
    </div>
  );
}
