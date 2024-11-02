'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface InstitutionCreateData {
  institutionName: string;
  institutionType: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  description?: string;
  status: "active" | "inactive";
}

interface InstitutionCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InstitutionCreateData) => Promise<void>;
}

export function InstitutionCreateDialog({
  open,
  onOpenChange,
  onSubmit,
}: InstitutionCreateDialogProps) {
  const [formData, setFormData] = useState<InstitutionCreateData>({
    institutionName: '',
    institutionType: '',
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    description: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
      setFormData({
        institutionName: '',
        institutionType: '',
        username: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        description: '',
        status: 'active',
      });
    } catch (error) {
      console.error('Error creating institution:', error);
      alert('创建机构失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>新增机构</DialogTitle>
          <DialogDescription>
            创建新的机构账号，带 * 的字段为必填项
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="institutionName">机构名称 *</Label>
                <Input
                  id="institutionName"
                  required
                  placeholder="请输入机构名称"
                  value={formData.institutionName}
                  onChange={(e) =>
                    setFormData({ ...formData, institutionName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="institutionType">机构类型 *</Label>
                <Select
                  value={formData.institutionType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, institutionType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择机构类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">教育机构</SelectItem>
                    <SelectItem value="training">培训机构</SelectItem>
                    <SelectItem value="enterprise">企业</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ... 其他表单字段 ... */}
            
            <div className="grid gap-2">
              <Label htmlFor="description">机构简介</Label>
              <Textarea
                id="description"
                placeholder="请输入机构简介"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "创建中..." : "创建机构"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 