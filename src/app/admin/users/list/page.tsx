'use client';

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/users/DataTable";
import { UserDetailDialog } from "@/components/admin/users/UserDetailDialog";
import { UserEditDialog } from "@/components/admin/users/UserEditDialog";
import { UserCreateDialog } from "@/components/admin/users/UserCreateDialog";
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
import { User, UserDetails, UserEditData } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function UserListPage() {
  const [data, setData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSaveUser = async (userData: UserEditData) => {
    try {
      const response = await fetch(`/api/admin/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        setData(data.map(user => 
          user.id === userData.id ? { ...user, ...userData } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleViewDetails = async (user: User) => {
    try {
      // 获取用户详细信息
      const response = await fetch(`/api/admin/users/${user.id}/details`);
      const result = await response.json();
      setSelectedUser(result.data);
      setIsDetailOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        setData([...data, result.data]);
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map(user => user.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleBatchOperation = async (operation: 'enable' | 'disable' | 'delete') => {
    if (selectedRows.length === 0) {
      alert('请选择要操作的用户');
      return;
    }

    const confirmMessage = {
      enable: '确定要启用选中的用户吗？',
      disable: '确定要禁用选中的用户吗？',
      delete: '确定要删除选中的用户吗？',
    };

    if (window.confirm(confirmMessage[operation])) {
      try {
        const response = await fetch('/api/admin/users/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operation,
            userIds: selectedRows,
          }),
        });

        if (response.ok) {
          // 更新本地数据
          if (operation === 'delete') {
            setData(data.filter(user => !selectedRows.includes(user.id)));
          } else {
            setData(data.map(user => {
              if (selectedRows.includes(user.id)) {
                return {
                  ...user,
                  status: operation === 'enable' ? 'active' : 'inactive',
                };
              }
              return user;
            }));
          }
          setSelectedRows([]);
        }
      } catch (error) {
        console.error('Error performing batch operation:', error);
        alert('操作失败，请重试');
      }
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            用户名
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: "姓名",
    },
    {
      accessorKey: "email",
      header: "邮箱",
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
      accessorKey: "createdAt",
      header: "注册时间",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">打开单</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  handleViewDetails(user);
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
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  // 实现禁用账号的逻辑
                }}
              >
                禁用账号
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return <AdminLayout title="用户管理">加载中...</AdminLayout>;
  }

  return (
    <AdminLayout title="用户管理">
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="space-x-2">
            <Button onClick={() => setIsCreateOpen(true)}>新增用户</Button>
            <Button variant="outline">导出数据</Button>
          </div>
          {selectedRows.length > 0 && (
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => handleBatchOperation('enable')}
              >
                批量启用
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleBatchOperation('disable')}
              >
                批量禁用
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleBatchOperation('delete')}
              >
                批量删除
              </Button>
            </div>
          )}
        </div>
        <DataTable 
          columns={columns} 
          data={data}
          enableRowSelection
          onRowSelectionChange={setSelectedRows}
        />
      </div>

      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      )}

      {selectedUser && (
        <UserEditDialog
          user={selectedUser}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSave={handleSaveUser}
        />
      )}

      <UserCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateUser}
      />
    </AdminLayout>
  );
} 