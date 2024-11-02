'use client';

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/users/DataTable";
import { UserDetailDialog } from "@/components/admin/users/UserDetailDialog";
import { UserEditDialog } from "@/components/admin/users/UserEditDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

// 机构用户类型定义
interface InstitutionUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
  institutionName: string;
  institutionType: string;
  verificationStatus: "pending" | "verified" | "rejected";
}

export default function InstitutionListPage() {
  const [data, setData] = useState<InstitutionUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<InstitutionUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users/institutions');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching institution users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns: ColumnDef<InstitutionUser>[] = [
    {
      accessorKey: "institutionName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            机构名称
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "institutionType",
      header: "机构类型",
    },
    {
      accessorKey: "name",
      header: "负责人",
    },
    {
      accessorKey: "email",
      header: "联系邮箱",
    },
    {
      accessorKey: "verificationStatus",
      header: "认证状态",
      cell: ({ row }) => {
        const status = row.getValue("verificationStatus") as string;
        const statusMap = {
          pending: { label: "待审核", variant: "warning" },
          verified: { label: "已认证", variant: "success" },
          rejected: { label: "已拒绝", variant: "destructive" },
        };
        const { label, variant } = statusMap[status as keyof typeof statusMap];
        return (
          <Badge variant={variant as any}>{label}</Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status === "active" ? "正常" : "禁用"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">打开菜单</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setIsDetailOpen(true);
                }}
              >
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setIsEditOpen(true);
                }}
              >
                编辑信息
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                禁用账号
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return <AdminLayout title="机构用户管理">加载中...</AdminLayout>;
  }

  return (
    <AdminLayout title="机构用户管理">
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="space-x-2">
            <Button>新增机构</Button>
            <Button variant="outline">导出数据</Button>
          </div>
          <div className="space-x-2">
            <Button variant="outline">批量导入</Button>
            <Button variant="outline">批量操作</Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>

      <UserDetailDialog
        user={selectedUser as any}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <UserEditDialog
        user={selectedUser as any}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSave={() => {}}
      />
    </AdminLayout>
  );
} 