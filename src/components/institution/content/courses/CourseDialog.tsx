'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "课程名称至少2个字符"),
  brief: z.string().min(10, "课程简介至少10个字符"),
  mt: z.string(),
  st: z.string(),
  charge: z.enum(["201000", "201001"]),
  price: z.number().min(0),
});

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  course?: {
    id: string;
    name: string;
    brief: string;
    mt: string;
    st: string;
    charge: string;
    price: number;
  };
}

export function CourseDialog({
  open,
  onOpenChange,
  onSuccess,
  course,
}: CourseDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: course?.name || '',
      brief: course?.brief || '',
      mt: course?.mt || '',
      st: course?.st || '',
      charge: (course?.charge || '201001') as "201000" | "201001",
      price: course?.price || 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(course ? `/course/${course.id}` : '/course', {
        method: course ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: course ? "更新成功" : "创建成功",
          description: "课程信息已保存",
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{course ? '编辑课程' : '创建课程'}</DialogTitle>
          <DialogDescription>
            {course ? '修改课程信息' : '创建新的课程'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>课程名称</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入课程名称" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>课程简介</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="请输入课程简介" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>课程大类</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择课程大类" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">前端开发</SelectItem>
                        <SelectItem value="2">后端开发</SelectItem>
                        <SelectItem value="3">移动开发</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="st"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>课程小类</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择课程小类" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">HTML/CSS</SelectItem>
                          <SelectItem value="2">JavaScript</SelectItem>
                          <SelectItem value="3">React</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="charge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>收费方式</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择收费方式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="201000">免费</SelectItem>
                          <SelectItem value="201001">收费</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.getValues().charge === "201001" && (
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>课程价格</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="请输入课程价格" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                {loading ? "保存中..." : "保存"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 