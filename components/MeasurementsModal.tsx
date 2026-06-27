"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Product } from "@/data/products";

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product;
  onSave?: (measurements: Record<string, string>) => void;
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
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());
}

function buildMessage({
  productName,
  measurements,
}: {
  productName: string;
  measurements: Record<string, string>;
}) {
  const lines = [
    "Hello Poshkaar",
    "",
    `I would like to share measurements for *${productName}*.`,
    "",
    "Measurements:",
  ];

  Object.entries(measurements).forEach(([key, value]) => {
    if (value && key !== "comments") {
      lines.push(`- ${prettyLabel(key)}: ${value}`);
    }
  });

  if (measurements.comments) {
    lines.push("", "Notes:", measurements.comments);
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
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setForm(defaultForm);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || !open) return null;

  const update = (key: keyof typeof defaultForm, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const save = () => {
    onSave?.(form);
    onClose();
  };

  const send = () => {
    onSave?.(form);
    const message = buildMessage({
      productName: product.name,
      measurements: form,
    });
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#171412]">
              Custom Measurements
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Save the details to your cart or send them to Poshkaar on WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-black/10"
            aria-label="Close measurements"
            title="Close measurements"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(Object.keys(defaultForm) as Array<keyof typeof defaultForm>)
            .filter((key) => key !== "comments")
            .map((key) => (
              <label key={key}>
                <span className="text-sm font-semibold text-gray-700">
                  {prettyLabel(key)}
                </span>
                <input
                  type="text"
                  value={form[key]}
                  onChange={(event) => update(key, event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 text-sm outline-none focus:border-[#8a1538] focus:ring-2 focus:ring-[#8a1538]/20"
                />
              </label>
            ))}
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-gray-700">Notes</span>
          <textarea
            rows={3}
            value={form.comments}
            onChange={(event) => update("comments", event.target.value)}
            className="mt-2 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#8a1538] focus:ring-2 focus:ring-[#8a1538]/20"
          />
        </label>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            className="h-11 rounded-md border border-black/15 text-sm font-bold"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="h-11 rounded-md bg-[#171412] text-sm font-bold text-white"
            onClick={save}
          >
            Save to Cart
          </button>
          <button
            type="button"
            className="h-11 rounded-md bg-green-600 text-sm font-bold text-white"
            onClick={send}
          >
            Send WhatsApp
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
