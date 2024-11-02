'use client';

import { Card } from "@/components/ui/card";
import { DonutChart as TremorDonutChart } from "@tremor/react";

interface DonutChartProps {
  data: any[];
  category: string;
  value: string;
  title?: string;
}

export function DonutChart({ data, category, value, title }: DonutChartProps) {
  return (
    <Card className="p-4">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <TremorDonutChart
        data={data}
        category={category}
        index={value}
        colors={["primary", "secondary", "accent", "info", "warning"]}
        className="h-[300px] mt-4"
        showAnimation
        showLabel
      />
    </Card>
  );
} 