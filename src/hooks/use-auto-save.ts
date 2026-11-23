"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { tf, useI18n } from "@/i18n/client";
import type { JobDto } from "@/lib/types";

/** Fired on window once a finished video has been handed to the device. */
export const SAVED_EVENT = "snapper:saved";

/** Run `onSaved` whenever a video has been saved to the device (used to clear the form). */
export function useOnSaved(onSaved: () => void) {
  useEffect(() => {
    window.addEventListener(SAVED_EVENT, onSaved);
    return () => window.removeEventListener(SAVED_EVENT, onSaved);
  }, [onSaved]);
}

/** Ask the browser to save a finished job's file to the device's Downloads folder. */
export function saveJobToDevice(id: string) {
  // The file route sends Content-Disposition: attachment, so the browser
  // streams it straight to disk without leaving the page (no blob in memory).
  const anchor = document.createElement("a");
  anchor.href = `/api/downloads/${id}/file?mode=download`;
  anchor.download = "";
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/**
 * Every finished job is handed to the browser so it lands in the device's
 * Downloads folder; the server deletes its copy once the file is fully sent.
 * A completed job still listed by the server has therefore not been saved yet
 * (e.g. it finished while the tab was closed), so it is saved on the next load.
 */
export function useAutoSave(jobs: JobDto[]) {
  const { ui } = useI18n();
  const triggered = useRef<Set<string>>(new Set());

  useEffect(() => {
    let queued = 0;
    for (const job of jobs) {
      if (job.status !== "completed" || triggered.current.has(job.id)) continue;
      triggered.current.add(job.id);
      // Stagger several simultaneous finishes so browsers do not drop any.
      window.setTimeout(() => {
        saveJobToDevice(job.id);
        window.dispatchEvent(new Event(SAVED_EVENT));
      }, queued++ * 800);
      toast.success(ui.savingToDevice, { description: tf(ui.savingToDeviceHint, { title: job.title }) });
    }
  }, [jobs, ui]);
}
