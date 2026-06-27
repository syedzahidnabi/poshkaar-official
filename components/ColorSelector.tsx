"use client";

type Props = {
  colors: string[];
  selected?: string;
  onSelect: (color: string) => void;
};

export default function ColorSelector({ colors, selected, onSelect }: Props) {
  if (!colors.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => {
        const active = color === selected;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            aria-pressed={active}
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
              active
                ? "border-[#8a1538] bg-[#8a1538] text-white"
                : "border-black/15 bg-white text-[#171412] hover:border-[#8a1538]"
            }`}
          >
            {color}
          </button>
        );
      })}
    </div>
  );
}
