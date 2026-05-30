import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, AuthInput, AuthButton } from "@/components/auth/AuthShell";
import { signIn } from "@/lib/mock-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create your workspace — SyncBridge" }, { name: "description", content: "Start automating with SyncBridge in minutes." }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(email, name);
    navigate({ to: "/app" });
  };
  return (
    <AuthShell
      title="Create your workspace"
      subtitle="14-day free trial. No credit card required."
      footer={<>Already have an account? <Link to="/login" className="text-primary font-semibold">Sign in</Link></>}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <AuthInput label="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
        <AuthInput label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <AuthInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <AuthButton type="submit">Create workspace</AuthButton>
        <p className="text-[11px] text-muted-foreground text-center">
          By signing up, you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}