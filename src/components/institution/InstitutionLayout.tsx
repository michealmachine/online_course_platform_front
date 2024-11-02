'use client';

import { Separator } from "@/components/ui/separator";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function InstitutionLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <AuthGuard allowedRoles={['INSTITUTION']}>
      <div className="space-y-6 p-6 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">
            管理机构课程和订单数据
          </p>
        </div>
        <Separator />
        <div className="flex-1 space-y-4">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
} 