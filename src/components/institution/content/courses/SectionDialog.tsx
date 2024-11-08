'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  courseId: number;
  chapterId: number;
  section?: {
    id: number;
    name: string;
    mediaType?: string;
    mediaFileName?: string;
  };
}

export function SectionDialog({
  open,
  onOpenChange,
  onSuccess,
  courseId,
  chapterId,
  section,
}: SectionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: section?.name || '',
    mediaFileName: section?.mediaFileName || '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/teachplan/section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          parentId: chapterId,
          name: formData.name,
          level: 2,
          mediaType: 'video',
          mediaFileName: formData.mediaFileName,
        }),
      });

      if (response.ok) {
        toast({
          title: section ? "更新成功" : "创建成功",
          description: "小节信息已保存",
        });
        onSuccess?.();
        onOpenChange(false);
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      toast({
        title: "保存失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{section ? '编辑小节' : '添加小节'}</DialogTitle>
          <DialogDescription>
            {section ? '修改小节信息' : '创建新的小节'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">小节名称</label>
            <Input
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="请输入小节名称"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">媒资文件</label>
            <Input
              value={formData.mediaFileName}
              onChange={e => setFormData(prev => ({ ...prev, mediaFileName: e.target.value }))}
              placeholder="请选择媒资文件"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 