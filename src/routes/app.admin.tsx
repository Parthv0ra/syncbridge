import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/app/AppSidebar";
import { adminUsers } from "@/lib/mock-data";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin — SyncBridge" }] }),
  component: AdminPage,
});

type Role = "owner" | "admin" | "member";

const roleStyles: Record<Role, string> = {
  owner: "bg-primary/10 text-primary",
  admin: "bg-violet-500/10 text-violet-700",
  member: "bg-muted text-muted-foreground",
};

function AdminPage() {
  const [users, setUsers] = useState(adminUsers);

  const changeRole = (id: string, role: Role) =>
    setUsers((u) => u.map((user) => (user.id === id ? { ...user, role } : user)));

  return (
    <>
      <PageHeader
        title="Admin"
        subtitle="Manage workspace members and permissions."
        action={
          <button className="inline-flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            <UserPlus className="size-4" /> Invite member
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total members", value: users.length },
          { label: "Active", value: users.filter((u) => u.status === "Active").length },
          { label: "Pending invites", value: users.filter((u) => u.status === "Invited").length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-muted-foreground bg-surface">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Member</th>
              <th className="text-left py-3 font-semibold">Role</th>
              <th className="text-right py-3 font-semibold">Workflows</th>
              <th className="text-right py-3 font-semibold">Status</th>
              <th className="text-right px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-5 py-3">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </td>
                <td className="py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${roleStyles[u.role as Role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 text-right font-mono text-xs">{u.workflows}</td>
                <td className="py-3 text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${u.status === "Active" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  {u.role !== "owner" && (
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value as Role)}
                      className="text-xs border border-input rounded-md px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="admin">admin</option>
                      <option value="member">member</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
