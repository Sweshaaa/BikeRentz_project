import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../lib/auth";
import { paths } from "../config/paths";
import "./AuthForms.css";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "user" },
  });

  async function onSubmit(data: FormData) {
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      toast.success("Account created!");
      navigate(paths.home);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div className="br-auth-page">
      <form className="card br-auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create Account</h2>
        <label>
          Name
          <input type="text" {...register("name")} />
          {errors.name && <span className="br-auth-error">{errors.name.message}</span>}
        </label>
        <label>
          Email
          <input type="email" {...register("email")} />
          {errors.email && <span className="br-auth-error">{errors.email.message}</span>}
        </label>
        <label>
          Role
          <select {...register("role")}>
            <option value="user">Member (User)</option>
            <option value="admin">Administrator (Admin)</option>
          </select>
          {errors.role && <span className="br-auth-error">{errors.role.message}</span>}
        </label>
        <label>
          Password
          <input type="password" {...register("password")} />
          {errors.password && <span className="br-auth-error">{errors.password.message}</span>}
        </label>
        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
        <p className="br-auth-footer">
          Already have an account? <Link to={paths.login}>Log in</Link>
        </p>
      </form>
    </div>
  );
}
