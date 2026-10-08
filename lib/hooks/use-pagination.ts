"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function usePagination<T>(items: T[], pageSize = 8, paramKey = "page") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, Number(searchParams.get(paramKey)) || 1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  );

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, String(next));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { page: safePage, totalPages, paginated, setPage };
}
