'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Question } from "@/types/exam";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ChapterQuestions {
  chapterId: string;
  chapterTitle: string;
  questions: Question[];
}

interface QuestionDetailDialogProps {
  chapterQuestions: ChapterQuestions;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionDetailDialog({
  chapterQuestions,
  open,
  onOpenChange,
}: QuestionDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{chapterQuestions.chapterTitle} - 试题列表</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-8">
            {chapterQuestions.questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">题目 {index + 1}</h4>
                  <Badge variant="outline">
                    {question.options.length} 个选项
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>题目内容</Label>
                  <p className="text-sm">{question.content}</p>
                </div>

                <div className="space-y-4">
                  <Label>选项</Label>
                  <RadioGroup value={question.correctOptionId} disabled>
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                        <Label htmlFor={`${question.id}-${option.id}`} className="flex-1">
                          {option.content}
                          {option.id === question.correctOptionId && (
                            <Badge variant="default" className="ml-2">
                              正确答案
                            </Badge>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="text-sm text-muted-foreground">
                  创建时间：{new Date(question.createdAt).toLocaleString()}
                </div>

                {index < chapterQuestions.questions.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 