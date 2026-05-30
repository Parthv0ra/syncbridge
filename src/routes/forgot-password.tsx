import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, AuthInput, AuthButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — SyncBridge" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send a reset link to your work email."
      footer={<><Link to="/login" className="text-primary font-semibold">Back to sign in</Link></>}
    >
      {sent ? (
        <div className="rounded-md bg-primary/5 border border-primary/15 p-4 text-sm">
          If <span className="font-semibold">{email}</span> matches an account, a reset link is on its way.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <AuthInput label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <AuthButton type="submit">Send reset link</AuthButton>
        </form>
      )}
    </AuthShell>
  );
}