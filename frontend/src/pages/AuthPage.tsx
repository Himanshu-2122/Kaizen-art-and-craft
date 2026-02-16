import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  X, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobilenumber: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        await signIn(form.email, form.password);
        toast.success("Welcome back! 🎉");
      } else {
        await signUp({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          password: form.password,
        });
        toast.success("Account created successfully! 🎉");
      }

      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = () => {
    const password = form.password;
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Weak", color: "bg-red-500" },
      { strength: 2, label: "Fair", color: "bg-yellow-500" },
      { strength: 3, label: "Good", color: "bg-blue-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Floating Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E67235] rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Backdrop Blur Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={() => navigate(-1)}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md animate-slide-up">
        {/* Decorative Elements */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#E67235] to-amber-500 rounded-full blur-2xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse-slow"></div>

        {/* Main Card */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E67235] via-amber-500 to-[#E67235] animate-gradient-x"></div>

          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute right-4 top-4 z-10 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90 group"
          >
            <X size={20} className="group-hover:scale-110 transition-transform" />
          </button>

          {/* Content */}
          <div className="p-8 pt-12">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E67235] to-amber-500 rounded-2xl blur-lg opacity-50 animate-pulse-slow"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-[#E67235] to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back!" : "Create Account"}
              </h2>
              <p className="text-gray-600 text-sm">
                {isLogin
                  ? "Login to continue your shopping"
                  : "Join us for exclusive deals and offers"}
              </p>
              
              {/* Badge */}
              {!isLogin && (
                <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-[#E67235]/10 to-amber-500/10 rounded-full">
                  <Sparkles className="w-4 h-4 text-[#E67235]" />
                  <span className="text-xs font-semibold text-gray-700">
                    Get 10% off on first order
                  </span>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-4 animate-slide-down">
                  <InputField
                    icon={User}
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={User}
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                  />

                  <InputField
                    icon={Phone}
                    name="mobilenumber"
                    placeholder="Mobile Number"
                    value={form.mobilenumber}
                    onChange={handleChange}
                    type="tel"
                  />
                </div>
              )}

              <InputField
                icon={Mail}
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />

              {/* Password with Strength Indicator */}
              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#E67235] transition-colors" />
                  
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                    required
                    className="w-full border-2 border-gray-200 rounded-2xl pl-12 pr-12 py-3.5 focus:outline-none focus:border-[#E67235] focus:ring-4 focus:ring-[#E67235]/10 transition-all duration-300 text-sm placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {showPass ? (
                      <EyeOff size={18} className="hover:scale-110 transition-transform" />
                    ) : (
                      <Eye size={18} className="hover:scale-110 transition-transform" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {!isLogin && form.password && passwordFocus && (
                  <div className="space-y-2 animate-slide-down">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        ></div>
                      ))}
                    </div>
                    {passwordStrength.label && (
                      <p className="text-xs text-gray-600">
                        Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Forgot Password */}
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-[#E67235] hover:text-[#d66330] font-medium hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="relative w-full bg-gradient-to-r from-[#E67235] to-amber-500 text-white rounded-2xl py-4 font-semibold hover:shadow-lg hover:shadow-[#E67235]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <span className="relative flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Please wait...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? "LOGIN" : "CREATE ACCOUNT"}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Switch Mode Button */}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setForm({
                    fullName: "",
                    username: "",
                    email: "",
                    mobilenumber: "",
                    password: "",
                  });
                }}
                className="w-full border-2 border-gray-200 rounded-2xl py-3.5 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium text-gray-700 group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? "Create new account" : "Back to login"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>

            {/* Terms & Privacy */}
            {!isLogin && (
              <p className="text-xs text-center text-gray-500 mt-6 animate-fade-in">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-[#E67235] hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#E67235] hover:underline">
                  Privacy Policy
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}

/* ---------- Enhanced Input Field Component ---------- */
interface InputFieldProps {
  icon: React.ElementType;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({ 
  icon: Icon, 
  name, 
  type = "text", 
  placeholder, 
  value, 
  onChange 
}: InputFieldProps) {
  return (
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#E67235] transition-colors duration-300" />
      
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full border-2 border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#E67235] focus:ring-4 focus:ring-[#E67235]/10 transition-all duration-300 text-sm placeholder:text-gray-400 hover:border-gray-300"
      />
    </div>
  );
}