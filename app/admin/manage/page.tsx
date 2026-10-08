"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Users, Trash2 } from "lucide-react";
import { useAllUsers, useDeleteUser } from "@/lib/hooks/use-users";
import { useUrlState } from "@/lib/hooks/use-url-state";
import { usePagination } from "@/lib/hooks/use-pagination";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { getErrorMessage } from "@/lib/api";
import { SearchInput } from "@/components/shared/search-input";
import { Select } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, formatBloodGroup } from "@/lib/types";

const ROLE_BADGE: Record<string, "default" | "success" | "muted"> = {
  ADMIN: "default",
  DONOR: "success",
  REQUESTER: "muted",
};

export default function ManageUsersPage() {
  const [search, setSearch] = useUrlState("q");
  const [role, setRole] = useUrlState("role");
  const debouncedSearch = useDebounce(search);

  const { data: users, isLoading } = useAllUsers();
  const deleteUser = useDeleteUser();

  const filtered = useMemo(() => {
    return (users ?? []).filter((u) => {
      const matchesSearch =
        !debouncedSearch ||
        u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesRole = !role || u.role === role;
      return matchesSearch && matchesRole;
    });
  }, [users, debouncedSearch, role]);

  const { page, totalPages, paginated, setPage } = usePagination(filtered, 8);

  const handleDelete = (user: User) => {
    if (!confirm(`Remove ${user.name}'s account?`)) return;
    deleteUser.mutate(user.id, {
      onSuccess: () => toast.success(`${user.name} removed`),
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const columns: Column<User>[] = [
    {
      header: "Name",
      render: (u) => (
        <div>
          <p className="font-medium">{u.name}</p>
          <p className="text-xs text-muted-foreground">{u.email}</p>
        </div>
      ),
    },
    { header: "Role", render: (u) => <Badge variant={ROLE_BADGE[u.role]}>{u.role}</Badge> },
    { header: "Blood group", render: (u) => formatBloodGroup(u.bloodGroup) },
    { header: "District", render: (u) => u.city || "—" },
    {
      header: "Actions",
      render: (u) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(u)}
          loading={deleteUser.isPending}
          className="text-danger hover:bg-danger/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Manage users</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {users?.length ?? 0} accounts
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email..."
          className="sm:w-80"
        />
        <Select value={role} onChange={(e) => setRole(e.target.value)} className="sm:w-48">
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="DONOR">Donor</option>
          <option value="REQUESTER">Requester</option>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading users...</p>
      ) : paginated.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try a different search or filter." />
      ) : (
        <div className="space-y-4">
          <DataTable columns={columns} rows={paginated} getRowKey={(u) => u.id} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
