"use client";

import { useRouter } from "next/navigation";

/** "ترتيب حسب" dropdown: navigates with the chosen sort, keeping the price range. */
export default function SortSelect({ base, range, value, options, label }: { base: string; range?: string; value: string; options: Record<string, string>; label: string }) {
  const router = useRouter();
  return (
    <select
      aria-label={label}
      defaultValue={value}
      onChange={(e) => {
        const sp = new URLSearchParams();
        if (e.target.value) sp.set("sort", e.target.value);
        if (range) sp.set("range", range);
        const q = sp.toString();
        router.push(q ? `${base}?${q}` : base);
      }}
      className="h-[46px] w-[228px] rounded border border-black bg-transparent px-3 text-[14px] dark:border-white"
    >
      {Object.entries(options).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </select>
  );
}
