import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface UserDetails {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
  role: string;
  avatar?: string;
}

interface UserDetailDialogProps {
  user: UserDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>用户详情</DialogTitle>
          <DialogDescription>
            查看用户的详细信息
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>用户ID</Label>
                  <p className="text-sm text-muted-foreground">{user.id}</p>
                </div>
                <div>
                  <Label>用户名</Label>
                  <p className="text-sm text-muted-foreground">{user.username}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>姓名</Label>
                  <p className="text-sm text-muted-foreground">{user.name}</p>
                </div>
                <div>
                  <Label>邮箱</Label>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>手机号码</Label>
                  <p className="text-sm text-muted-foreground">{user.phone || '未设置'}</p>
                </div>
                <div>
                  <Label>账号状态</Label>
                  <p className="text-sm text-muted-foreground">
                    {user.status === 'active' ? '正常' : '禁用'}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>注册时间</Label>
                  <p className="text-sm text-muted-foreground">{user.createdAt}</p>
                </div>
                <div>
                  <Label>最后登录</Label>
                  <p className="text-sm text-muted-foreground">{user.lastLogin || '从未登录'}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 