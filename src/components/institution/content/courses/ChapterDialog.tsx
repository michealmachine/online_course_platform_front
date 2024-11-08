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

interface ChapterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  courseId: number;
  chapter?: {
    id: number;
    name: string;
    orderBy: number;
  };
}

export function ChapterDialog({
  open,
  onOpenChange,
  onSuccess,
  courseId,
  chapter,
}: ChapterDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(chapter?.name || '');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/teachplan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          name,
          level: 1,
          orderBy: chapter?.orderBy || 1,
        }),
      });

      if (response.ok) {
        toast({
          title: chapter ? "更新成功" : "创建成功",
          description: "章节信息已保存",
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
          <DialogTitle>{chapter ? '编辑章节' : '添加章节'}</DialogTitle>
          <DialogDescription>
            {chapter ? '修改章节信息' : '创建新的章节'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">章节名称</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="请输入章节名称"
              required
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