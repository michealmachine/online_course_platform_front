'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseBasic } from "@/types/exam";
import { Plus, Trash2, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface Question {
  content: string;
  options: Array<{
    id: string;
    content: string;
  }>;
  correctOptionId: string;
}

interface QuestionForm {
  chapterId: string;
  questions: Question[];
}

interface QuestionDialogProps {
  course: CourseBasic;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionDialog({
  course,
  open,
  onOpenChange,
}: QuestionDialogProps) {
  const [formData, setFormData] = useState<QuestionForm>({
    chapterId: '',
    questions: [{
      content: '',
      options: [
        { id: '1', content: '' },
        { id: '2', content: '' },
        { id: '3', content: '' },
      ],
      correctOptionId: '',
    }],
  });

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          content: '',
          options: [
            { id: '1', content: '' },
            { id: '2', content: '' },
            { id: '3', content: '' },
          ],
          correctOptionId: '',
        },
      ],
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex].content = value;
    setFormData({
      ...formData,
      questions: newQuestions,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/institution/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          ...formData,
        }),
      });

      if (response.ok) {
        onOpenChange(false);
        // 重置表单
        setFormData({
          chapterId: '',
          questions: [{
            content: '',
            options: [
              { id: '1', content: '' },
              { id: '2', content: '' },
              { id: '3', content: '' },
            ],
            correctOptionId: '',
          }],
        });
      }
    } catch (error) {
      console.error('Error creating questions:', error);
      alert('创建试题失败');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>添加试题</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>选择章节</Label>
                <Select
                  value={formData.chapterId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, chapterId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择章节" />
                  </SelectTrigger>
                  <SelectContent>
                    {course.chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="space-y-4 pt-4">
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">题目 {questionIndex + 1}</h4>
                    {formData.questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestion(questionIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>题目内容</Label>
                    <Input
                      value={question.content}
                      onChange={(e) =>
                        handleQuestionChange(questionIndex, 'content', e.target.value)
                      }
                      placeholder="请输入题目内容"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>选项</Label>
                    <RadioGroup
                      value={question.correctOptionId}
                      onValueChange={(value) =>
                        handleQuestionChange(questionIndex, 'correctOptionId', value)
                      }
                    >
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 mb-4"
                        >
                          <RadioGroupItem value={option.id} id={`${questionIndex}-${option.id}`} />
                          <Input
                            value={option.content}
                            onChange={(e) =>
                              handleOptionChange(questionIndex, optionIndex, e.target.value)
                            }
                            placeholder={`选项 ${optionIndex + 1}`}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddQuestion}
              >
                <Plus className="h-4 w-4 mr-2" />
                添加题目
              </Button>
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit">
              <Check className="h-4 w-4 mr-2" />
              保存试题
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 