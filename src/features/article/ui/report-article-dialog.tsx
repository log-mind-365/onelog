"use client";

import { useState } from "react";
import type { ReportArticleDialogProps } from "@/app/_providers/modal-store";
import { useModal } from "@/app/_providers/modal-store";
import { useReportArticle } from "@/features/article/lib/use-report-article";
import { Button } from "@/shared/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Spinner } from "@/shared/components/ui/spinner";
import { Textarea } from "@/shared/components/ui/textarea";

const REPORT_TYPES = [
  { value: "spam", label: "스팸" },
  { value: "inappropriate", label: "부적절한 콘텐츠" },
  { value: "harassment", label: "괴롭힘" },
  { value: "other", label: "기타" },
] as const;

export const ReportArticleDialog = () => {
  const { props, closeModal } = useModal();
  const { mutate: onReport, isPending } = useReportArticle();
  const [reportType, setReportType] = useState<
    "spam" | "inappropriate" | "harassment" | "other"
  >("spam");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reportProps = props as ReportArticleDialogProps;
    if (!reportProps?.articleId || !reportProps?.reporterId) return;

    onReport(
      {
        articleId: reportProps.articleId,
        reporterId: reportProps.reporterId,
        reportType,
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          closeModal();
          setReportType("spam");
          setReason("");
        },
      },
    );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>게시물 신고</DialogTitle>
        <DialogDescription>
          이 게시물을 신고하는 이유를 선택해주세요.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="report-type" className="font-medium text-sm">
            신고 유형
            <Select
              value={reportType}
              onValueChange={(value) =>
                setReportType(
                  value as "spam" | "inappropriate" | "harassment" | "other",
                )
              }
            >
              <SelectTrigger id="report-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
        </div>

        <div className="space-y-2">
          <label htmlFor="reason" className="font-medium text-sm">
            상세 사유 (선택)
          </label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="신고 사유를 자세히 적어주세요..."
            rows={4}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={isPending}
            className="flex-1"
          >
            취소
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? <Spinner /> : "신고하기"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
