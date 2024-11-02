'use client';

import { useState, useEffect } from "react";
import InstitutionLayout from "@/components/institution/InstitutionLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { CourseBasic, Question } from "@/types/exam";
import { QuestionDialog } from "@/components/institution/exams/QuestionDialog";
import { QuestionDetailDialog } from "@/components/institution/exams/QuestionDetailDialog";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CourseQuestions extends CourseBasic {
  questions: Question[];
}

interface ChapterQuestions {
  chapterId: string;
  chapterTitle: string;
  questions: Question[];
}

export default function QuestionsPage() {
  const [courses, setCourses] = useState<CourseQuestions[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseBasic | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterQuestions | null>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await fetch('/api/institution/courses');
        const coursesResult = await coursesResponse.json();
        const coursesData = coursesResult.data;

        const coursesWithQuestions = await Promise.all(
          coursesData.map(async (course: CourseBasic) => {
            const questionsResponse = await fetch(`/api/institution/courses/${course.id}/questions`);
            const questionsResult = await questionsResponse.json();
            return {
              ...course,
              questions: questionsResult.data,
            };
          })
        );

        setCourses(coursesWithQuestions);
        setFilteredCourses(coursesWithQuestions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const toggleChapter = (courseId: string, chapterId: string) => {
    const key = `${courseId}-${chapterId}`;
    setExpandedChapters(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getChapterQuestions = (course: CourseQuestions, chapterId: string): ChapterQuestions => {
    const chapter = course.chapters.find(ch => ch.id === chapterId);
    return {
      chapterId,
      chapterTitle: chapter?.title || '',
      questions: course.questions.filter(q => q.chapterId === chapterId),
    };
  };

  if (loading) {
    return <InstitutionLayout title="试题管理">加载中...</InstitutionLayout>;
  }

  return (
    <InstitutionLayout title="试题管理">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>试题数量: {course.questions.length}</span>
                    <span>•</span>
                    <span>章节数量: {course.chapters.length}</span>
                  </div>
                </div>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {course.chapters.map((chapter) => {
                    const chapterQuestions = getChapterQuestions(course, chapter.id);
                    const isExpanded = expandedChapters[`${course.id}-${chapter.id}`];

                    return (
                      <Collapsible
                        key={chapter.id}
                        open={isExpanded}
                        onOpenChange={() => toggleChapter(course.id, chapter.id)}
                      >
                        <div className="border rounded-lg">
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent rounded-lg">
                            <div className="flex items-center gap-4">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <span className="font-medium">{chapter.title}</span>
                              <Badge variant="outline">
                                {chapterQuestions.questions.length} 题
                              </Badge>
                            </div>
                            {chapterQuestions.questions.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedChapter(chapterQuestions);
                                  setIsDetailDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                查看试题
                              </Button>
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="p-4 pt-0 space-y-2">
                              {chapterQuestions.questions.map((question, index) => (
                                <div
                                  key={question.id}
                                  className="p-4 border rounded-lg bg-muted/50"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                      <div className="font-medium">
                                        题目 {index + 1}
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {question.content}
                                      </p>
                                      <div className="text-xs text-muted-foreground">
                                        创建时间：{new Date(question.createdAt).toLocaleString()}
                                      </div>
                                    </div>
                                    <Badge>
                                      {question.options.length} 个选项
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          ))}
        </div>

        {selectedChapter && (
          <QuestionDetailDialog
            chapterQuestions={selectedChapter}
            open={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
          />
        )}
      </div>
    </InstitutionLayout>
  );
} 