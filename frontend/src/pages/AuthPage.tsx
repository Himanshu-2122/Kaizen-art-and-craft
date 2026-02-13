import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

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
        toast.success("Login successful 🎉");
      } else {
        await signUp({
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          password: form.password,
        });
        toast.success("Account created 🎉");
      }

      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      {/* Modal */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">

        {/* Close */}
        <button
          onClick={() => navigate(-1)}
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-8">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <>
              <Input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
              />

              <Input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />

              <Input
                name="mobilenumber"
                placeholder="Mobile Number"
                value={form.mobilenumber}
                onChange={handleChange}
              />
            </>
          )}

          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          {/* Password */}
          <div className="relative">
            <Input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-3 text-gray-500"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isLogin && (
            <p className="text-sm text-gray-500 cursor-pointer hover:underline">
              Forgot password?
            </p>
          )}

          {/* Primary button */}
          <button
            disabled={submitting}
            className="w-full bg-black text-white rounded-full py-3 font-medium hover:bg-gray-900 transition"
          >
            {submitting
              ? "Please wait..."
              : isLogin
              ? "LOGIN"
              : "CREATE ACCOUNT"}
          </button>

          {/* Switch */}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full border rounded-full py-3 hover:bg-gray-50 transition"
          >
            {isLogin ? "CREATE ACCOUNT" : "BACK TO LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- reusable input ---------- */
function Input(props: any) {
  return (
    <input
      {...props}
      required
      className="
        w-full
        border
        rounded-full
        px-5 py-3
        focus:outline-none
        focus:ring-2
        focus:ring-black
        text-sm
      "
    />
  );
}
