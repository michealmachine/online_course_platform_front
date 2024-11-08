'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Plus, Edit, ChevronDown, ChevronRight, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChapterDialog } from "./ChapterDialog";
import { SectionDialog } from "./SectionDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface Section {
  id: number;
  name: string;
  level: number;
  orderBy: number;
  mediaType?: string;
  mediaFileName?: string;
}

interface Chapter {
  id: number;
  name: string;
  level: number;
  orderBy: number;
  teachPlanTreeNodes: Section[];
}

interface ChapterListProps {
  courseId: number;
  chapters: Chapter[];
  onRefresh: () => void;
}

export function ChapterList({ courseId, chapters = [], onRefresh }: ChapterListProps) {
  const { toast } = useToast();
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({});
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'chapter' | 'section', id: number } | null>(null);

  const handleMoveSection = async (chapterId: number, sectionId: number, direction: 'up' | 'down') => {
    try {
      const response = await fetch(`/teachplan/${sectionId}/move${direction}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: "移动成功",
          description: "小节顺序已更新",
        });
        onRefresh();
      } else {
        throw new Error('移动失败');
      }
    } catch (error) {
      toast({
        title: "移动失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleAddChapter = () => {
    setSelectedChapter(null);
    setIsChapterDialogOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsChapterDialogOpen(true);
  };

  const handleAddSection = (e: React.MouseEvent, chapter: Chapter) => {
    e.stopPropagation();
    setSelectedChapter(chapter);
    setSelectedSection(null);
    setIsSectionDialogOpen(true);
  };

  const handleEditSection = (e: React.MouseEvent, chapter: Chapter, section: Section) => {
    e.stopPropagation();
    setSelectedChapter(chapter);
    setSelectedSection(section);
    setIsSectionDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    const response = await fetch(`/teachplan/${itemToDelete.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('删除失败');
    }

    onRefresh();
  };

  const handleDeleteClick = (e: React.MouseEvent, type: 'chapter' | 'section', id: number) => {
    e.stopPropagation();
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddChapter}>
          <Plus className="mr-2 h-4 w-4" />
          添加章节
        </Button>
      </div>

      {Array.isArray(chapters) && chapters.map((chapter) => (
        <Collapsible
          key={chapter?.id || 'temp'}
          open={expandedChapters[chapter?.id || 0]}
          onOpenChange={() => chapter?.id && toggleChapter(chapter.id)}
        >
          <div className="border rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent">
              <div className="flex items-center gap-2">
                {expandedChapters[chapter?.id || 0] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">{chapter?.name || ''}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => handleAddSection(e, chapter)}
              >
                <Plus className="mr-2 h-4 w-4" />
                添加小节
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => handleDeleteClick(e, 'chapter', chapter.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 space-y-2">
                {Array.isArray(chapter?.teachPlanTreeNodes) && chapter.teachPlanTreeNodes.map((section, index) => (
                  <div
                    key={section?.id || `section-${index}`}
                    className="flex items-center justify-between pl-8 py-2 hover:bg-accent rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span>{section?.name || ''}</span>
                      {section?.mediaFileName && (
                        <span className="text-xs text-muted-foreground">
                          ({section.mediaType}: {section.mediaFileName})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          section?.id && handleMoveSection(chapter.id, section.id, 'up');
                        }}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={index === (chapter?.teachPlanTreeNodes?.length || 0) - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          section?.id && handleMoveSection(chapter.id, section.id, 'down');
                        }}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => handleEditSection(e, chapter, section)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => handleDeleteClick(e, 'section', section.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}

      <ChapterDialog
        open={isChapterDialogOpen}
        onOpenChange={setIsChapterDialogOpen}
        courseId={courseId}
        chapter={selectedChapter || undefined}
        onSuccess={onRefresh}
      />

      {selectedChapter && (
        <SectionDialog
          open={isSectionDialogOpen}
          onOpenChange={setIsSectionDialogOpen}
          courseId={courseId}
          chapterId={selectedChapter.id}
          section={selectedSection || undefined}
          onSuccess={onRefresh}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`确认删除${itemToDelete?.type === 'chapter' ? '章节' : '小节'}`}
        description={`删除后将无法恢复，是否继续？`}
      />
    </div>
  );
} 