"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/data/products";

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product;
  onSave?: (m: Record<string, string>) => void;
  phone?: string;
};

const defaultForm = {
  height: "",
  chest: "",
  waist: "",
  hips: "",
  shoulder: "",
  armLength: "",
  sleeve: "",
  length: "",
  comments: "",
};

function prettyLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

function buildMessage({ productName, color, measurements, comments }: any) {
  const lines = [
    "Hello Poshkaar ✨",
    "",
    `I would like to order *${productName}*`,
  ];

  if (color) lines.push(`Colour: ${color}`, "");

  if (measurements) {
    lines.push("Measurements:");
    Object.entries(measurements).forEach(([k, v]: any) => {
      if (v) lines.push(`• ${prettyLabel(k)}: ${v}`);
    });
    lines.push("");
  }

  if (comments) {
    lines.push("Notes:");
    lines.push(comments);
    lines.push("");
  }

  return lines.join("\n");
}

export default function MeasurementsModal({
  open,
  onClose,
  product,
  onSave,
  phone = "916006491824",
}: Props) {
  console.log("MODAL COMPONENT RENDERED — open =", open);

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      console.log("MODAL OPENED — locking body scroll");
      document.body.style.overflow = "hidden";
      setForm(defaultForm);
    } else {
      console.log("MODAL CLOSED — restoring body scroll");
      document.body.style.overflow = "";
    }
  }, [open]);

  if (!mounted) return null;
  if (!open) return null;

  const update = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const send = () => {
    onSave?.(form);

    const msg = buildMessage({
      productName: product.name,
      measurements: form,
      comments: form.comments,
    });

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Custom Measurements</h2>

          <button onClick={onClose} className="text-3xl leading-none">
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(defaultForm)
            .filter(([k]) => k !== "comments")
            .map(([k]) => (
              <div key={k}>
                <label className="text-sm font-medium">{prettyLabel(k)}</label>
                <input
                  type="text"
                  value={form[k as keyof typeof form]}
                  onChange={(e) => update(k, e.target.value)}
                  className="border rounded-md w-full px-3 py-2 mt-1"
                />
              </div>
            ))}
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            rows={3}
            value={form.comments}
            onChange={(e) => update("comments", e.target.value)}
            className="border rounded-md w-full px-3 py-2 mt-1"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 border rounded" onClick={onClose}>
            Close
          </button>

          <button
            className="px-5 py-2 bg-green-600 text-white rounded shadow"
            onClick={send}
          >
            Send via WhatsApp
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
