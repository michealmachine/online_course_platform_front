'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateCourseDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCourseDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brief: '',
    mt: '',
    st: '',
    charge: '201001',
    price: 0,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/institution/content/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "创建成功",
          description: "课程已创建，可以继续编辑课程内容",
        });
        onSuccess?.();
        onOpenChange(false);
      } else {
        throw new Error('创建失败');
      }
    } catch (error) {
      toast({
        title: "创建失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>创建新课程</DialogTitle>
          <DialogDescription>
            填写课程基本信息，创建后可以继续编辑课程内容
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label>课程名称</label>
            <Input 
              placeholder="请输入课程名称" 
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label>课程简介</label>
            <Textarea 
              placeholder="请输入课程简介" 
              value={formData.brief}
              onChange={e => setFormData(prev => ({ ...prev, brief: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>课程大类</label>
              <Select 
                value={formData.mt}
                onValueChange={value => setFormData(prev => ({ ...prev, mt: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择课程大类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">前端开发</SelectItem>
                  <SelectItem value="2">后端开发</SelectItem>
                  <SelectItem value="3">移动开发</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label>课程小类</label>
              <Select
                value={formData.st}
                onValueChange={value => setFormData(prev => ({ ...prev, st: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择课程小类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">HTML/CSS</SelectItem>
                  <SelectItem value="2">JavaScript</SelectItem>
                  <SelectItem value="3">React</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label>收费方式</label>
            <Select
              value={formData.charge}
              onValueChange={value => setFormData(prev => ({ ...prev, charge: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择收费方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="201000">免费</SelectItem>
                <SelectItem value="201001">收费</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.charge === "201001" && (
            <div className="space-y-2">
              <label>课程价格</label>
              <Input 
                type="number" 
                placeholder="请输入课程价格" 
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                required
              />
            </div>
          )}
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
              {loading ? "创建中..." : "创建"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 