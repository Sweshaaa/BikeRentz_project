import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../lib/auth";
import { paths } from "../config/paths";
import "./AuthForms.css";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate(paths.home);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div className="br-auth-page">
      <form className="card br-auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Log In</h2>
        <label>
          Email
          <input type="email" {...register("email")} />
          {errors.email && <span className="br-auth-error">{errors.email.message}</span>}
        </label>
        <label>
          Password
          <input type="password" {...register("password")} />
          {errors.password && <span className="br-auth-error">{errors.password.message}</span>}
        </label>
        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
        <Link to={paths.forgotPassword} className="br-auth-footer">Forgot password?</Link>
        <p className="br-auth-footer">
          No account? <Link to={paths.register}>Sign up</Link>
        </p>
      </form>
    </div>
  );
}
