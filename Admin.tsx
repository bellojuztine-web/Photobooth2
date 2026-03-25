import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Shield, Users, ArrowLeft, Crown, Wrench, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole {
  user_id: string;
  display_name: string | null;
  email: string | null;
  role: AppRole;
  role_id: string;
  created_at: string;
}

const roleIcons: Record<AppRole, typeof Crown> = {
  admin: Crown,
  operator: Wrench,
  customer: UserIcon,
};

const roleColors: Record<AppRole, string> = {
  admin: "bg-accent text-accent-foreground",
  operator: "bg-secondary text-secondary-foreground",
  customer: "bg-muted text-muted-foreground",
};

export default function Admin() {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    setFetching(true);
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");

    if (profiles && roles) {
      const merged: UserWithRole[] = profiles.map((p) => {
        const userRole = roles.find((r) => r.user_id === p.user_id);
        return {
          user_id: p.user_id,
          display_name: p.display_name,
          email: p.email,
          role: (userRole?.role as AppRole) ?? "customer",
          role_id: userRole?.id ?? "",
          created_at: p.created_at,
        };
      });
      setUsers(merged);
    }
    setFetching(false);
  };

  const updateRole = async (roleId: string, userId: string, newRole: AppRole) => {
    if (userId === user?.id) {
      toast({ title: "Can't change your own role", variant: "destructive" });
      return;
    }
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("id", roleId);

    if (error) {
      toast({ title: "Failed to update role", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated! ✅" });
      fetchUsers();
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-fun flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage users and roles</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg">All Users ({users.length})</h2>
          </div>

          {fetching ? (
            <div className="p-10 text-center text-muted-foreground">Loading users...</div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((u) => {
                const RoleIcon = roleIcons[u.role];
                return (
                  <div key={u.user_id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleColors[u.role]}`}>
                        <RoleIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-foreground truncate">
                          {u.display_name || "Unnamed"}
                          {u.user_id === user?.id && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">You</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Select
                        value={u.role}
                        onValueChange={(val) => updateRole(u.role_id, u.user_id, val as AppRole)}
                        disabled={u.user_id === user?.id}
                      >
                        <SelectTrigger className="w-36 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">👑 Admin</SelectItem>
                          <SelectItem value="operator">🔧 Operator</SelectItem>
                          <SelectItem value="customer">👤 Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
