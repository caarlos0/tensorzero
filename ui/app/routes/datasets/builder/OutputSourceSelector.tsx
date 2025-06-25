import { FormField, FormItem, FormLabel } from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useWatch, type Control } from "react-hook-form";
import type { DatasetBuilderFormValues } from "./types";
import { useFetcher } from "react-router";
import type { MetricsWithFeedbackData } from "~/utils/clickhouse/feedback";
import { useEffect, useMemo } from "react";
import clsx from "clsx";

export default function OutputSourceSelector({
  control,
}: {
  control: Control<DatasetBuilderFormValues>;
}) {
  const fieldName = "output_source";
  const functionFieldName = "function";
  const metricsFetcher = useFetcher<MetricsWithFeedbackData>();
  const functionValue = useWatch({
    control,
    name: functionFieldName,
  });
  useEffect(() => {
    if (functionValue && typeof functionValue === "string") {
      metricsFetcher.load(
        `/api/function/${encodeURIComponent(functionValue)}/feedback_counts`,
      );
    }
    // TODO: Fix and stop ignoring lint rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionValue]);

  const demonstrationCount = useMemo(() => {
    if (!metricsFetcher.data) return 0;
    const demonstrationMetric = metricsFetcher.data.metrics.find(
      (m) => m.metric_type === "demonstration",
    );
    return demonstrationMetric?.feedback_count ?? 0;
  }, [metricsFetcher.data]);

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <FormLabel>Outputs</FormLabel>
          <div className="border-border bg-bg-primary rounded-lg border">
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col gap-0"
            >
              <FormLabel
                htmlFor="none"
                className="border-border flex cursor-pointer items-center space-x-2 border-b px-3 py-3"
              >
                <RadioGroupItem value="none" id="none" />
                <span>Without outputs</span>
              </FormLabel>
              <FormLabel
                htmlFor="inference"
                className="border-border flex w-full cursor-pointer items-center space-x-2 border-b px-3 py-3"
              >
                <RadioGroupItem value="inference" id="inference" />
                <span className="w-full">With inference outputs</span>
              </FormLabel>
              <FormLabel
                htmlFor="demonstration"
                className={clsx(
                  "flex items-center space-x-2 px-3 py-3",
                  demonstrationCount === 0
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer",
                )}
              >
                <RadioGroupItem
                  value="demonstration"
                  id="demonstration"
                  disabled={demonstrationCount === 0}
                />
                <div className="flex w-full items-center justify-between gap-2">
                  <span>With demonstration outputs</span>
                  <span className="text-fg-tertiary text-xs">
                    {demonstrationCount.toLocaleString()} available
                  </span>
                </div>
              </FormLabel>
            </RadioGroup>
          </div>
        </FormItem>
      )}
    />
  );
}
