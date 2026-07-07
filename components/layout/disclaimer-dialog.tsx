"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

const DISCLAIMER_KEY = "trump-predictor:disclaimer-seen";

type DisclaimerDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function DisclaimerDialog({ open, onClose }: DisclaimerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleAcknowledge() {
    try {
      localStorage.setItem(DISCLAIMER_KEY, "true");
    } catch {
      // Ignore storage errors.
    }
    dialogRef.current?.close();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed z-[var(--z-modal)] m-auto w-[min(100%-2rem,28rem)] rounded-xl border border-border bg-surface p-0 text-ink shadow-lg backdrop:bg-transparent open:animate-none"
      onClose={onClose}
    >
      <div className="p-6">
        <h2
          className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-[var(--tracking-display)] text-balance"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Before you start
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-secondary text-pretty">
          Trump Predictor is an AI analysis tool. Responses are generated from
          patterns in publicly documented events — not official statements from
          Donald Trump or any government entity.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-secondary text-pretty">
          Predictions about future behavior are speculative scenario analysis,
          not financial, legal, or voting advice.
        </p>
        <Button className="mt-6 w-full" onClick={handleAcknowledge}>
          I understand — start chatting
        </Button>
      </div>
    </dialog>
  );
}

export function hasSeenDisclaimer(): boolean {
  if (typeof window === "undefined") return true;

  try {
    return localStorage.getItem(DISCLAIMER_KEY) === "true";
  } catch {
    return true;
  }
}
