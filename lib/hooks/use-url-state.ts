"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useUrlState(key: string, defaultValue = "") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams.get(key) ?? defaultValue;

  const setValue = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!next) {
      params.delete(key);
    } else {
      params.set(key, next);
    }
    // reset pagination whenever a filter/search/sort value changes
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return [value, setValue] as const;
}
