"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  showInputs?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  showInputs = false,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputPage, setInputPage] = useState(currentPage.toString());
  const [inputPageSize, setInputPageSize] = useState(pageSize.toString());

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    params.set("pageSize", inputPageSize);
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("pageSize", newPageSize.toString());
    router.push(`?${params.toString()}`);
  };

  const handleInputPageSubmit = () => {
    const page = parseInt(inputPage, 10);
    if (page > 0 && page <= totalPages) {
      handlePageChange(page);
    } else {
      setInputPage(currentPage.toString());
    }
  };

  const handlePageSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputPageSize(value);
  };

  const handlePageSizeInputSubmit = () => {
    const newPageSize = parseInt(inputPageSize, 10);
    if (newPageSize > 0 && newPageSize <= 100) {
      handlePageSizeChange(newPageSize);
    } else {
      setInputPageSize(pageSize.toString());
    }
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Info Text */}
        <div className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{startItem}</span> sampai{" "}
          <span className="font-semibold text-foreground">{endItem}</span> dari{" "}
          <span className="font-semibold text-foreground">{totalItems}</span> total
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
          {/* Page Size Selector */}
          {showInputs && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Items per page:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={inputPageSize}
                onChange={handlePageSizeInputChange}
                onBlur={handlePageSizeInputSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePageSizeInputSubmit();
                  }
                }}
                className="w-16 px-2 py-1 rounded border border-border bg-background text-foreground text-sm"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg border border-border hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {/* First Page */}
              {currentPage > 2 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="w-8 h-8 rounded-lg border border-border hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    1
                  </button>
                  {currentPage > 3 && (
                    <span className="text-muted-foreground text-sm px-1">...</span>
                  )}
                </>
              )}

              {/* Page Numbers Around Current */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isNearCurrent =
                  pageNum >= currentPage - 1 && pageNum <= currentPage + 1;

                if (!isNearCurrent && totalPages > 5) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg transition-colors text-sm font-medium ${
                      pageNum === currentPage
                        ? "bg-primary text-primary-foreground border border-primary"
                        : "border border-border hover:bg-primary/20"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Last Page */}
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <span className="text-muted-foreground text-sm px-1">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="w-8 h-8 rounded-lg border border-border hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-border hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Halaman Berikutnya"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Direct Page Input */}
          {showInputs && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Go to page:</label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onBlur={handleInputPageSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleInputPageSubmit();
                  }
                }}
                className="w-16 px-2 py-1 rounded border border-border bg-background text-foreground text-sm"
              />
              <span className="text-sm text-muted-foreground">/ {totalPages}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
