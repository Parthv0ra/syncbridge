import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, AuthInput, AuthButton } from "@/components/auth/AuthShell";
import { signIn } from "@/lib/mock-auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — SyncBridge" }, { name: "description", content: "Sign in to your SyncBridge workspace." }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@syncbridge.io");
  const [password, setPassword] = useState("demo1234");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email);
    navigate({ to: "/app" });
  };
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your workspace."
      footer={<>No account? <Link to="/signup" className="text-primary font-semibold">Create one</Link></>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <AuthInput label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <AuthInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="accent-primary" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-primary font-semibold">Forgot password?</Link>
        </div>
        <AuthButton type="submit">Sign in</AuthButton>
      </form>
    </AuthShell>
  );
}