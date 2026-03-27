import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import {
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";

interface DateRangePickerProps {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  range,
  onRangeChange,
  className,
  placeholder = "Custom",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Only close if not clicking inside portal
        const portal = document.getElementById('date-picker-portal');
        if (!portal?.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      const rect = btnRef.current?.getBoundingClientRect();
      if (rect) {
        setCoords({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const footer = (
    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
      {range?.from ? (
        range.to ? (
          <span>
            {format(range.from, "LLL dd, y")} - {format(range.to, "LLL dd, y")}
          </span>
        ) : (
          <span>Select end date</span>
        )
      ) : (
        <span>Select start date</span>
      )}
      <button
        onClick={() => {
          onRangeChange(undefined);
          setIsOpen(false);
        }}
        className="text-rose-500 hover:text-rose-600 transition-colors"
      >
        Clear
      </button>
    </div>
  );

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-4 py-1.5 text-xs font-semibold rounded-md border transition-all duration-200 flex items-center gap-2 shrink-0",
          isOpen || range?.from
            ? "bg-rose-400 border-rose-400 text-white shadow-sm"
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
        )}
      >
        <CalendarIcon className="w-3.5 h-3.5" />
        {range?.from
          ? range.to
            ? `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd")}`
            : format(range.from, "MMM dd")
          : placeholder}
      </button>

      {isOpen && createPortal(
        <div
          id="date-picker-portal"
          className="absolute z-[9999] bg-white border border-slate-200 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-left"
          style={{
            top: `${coords.top + 8}px`,
            left: `${Math.max(10, Math.min(window.innerWidth - 620, coords.left))}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900 ml-1">
              Select Range
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-slate-50 rounded-md transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <DayPicker
            mode="range"
            selected={range}
            onSelect={onRangeChange}
            numberOfMonths={2}
            className="!m-0 text-xs"
            classNames={{
              root: "rdp-custom",
              months: "flex flex-col sm:flex-row gap-6",
              month: "space-y-4",
              caption:
                "flex justify-center pt-1 relative items-center mb-2 px-2",
              caption_label: "text-sm font-bold text-slate-800",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity border border-slate-200 rounded-md flex items-center justify-center",
              nav_button_previous: "absolute left-2",
              nav_button_next: "absolute right-2",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-slate-400 rounded-md w-8 font-bold text-[10px] uppercase text-center",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative focus-within:z-20",
              day: "h-8 w-8 p-0 font-semibold aria-selected:opacity-100 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-all text-slate-600",
              day_range_start:
                "day-range-start !bg-rose-400 !text-white !rounded-r-none !rounded-l-md",
              day_range_end:
                "day-range-end !bg-rose-400 !text-white !rounded-l-none !rounded-r-md",
              day_selected: "bg-rose-50 text-rose-600",
              day_today: "text-rose-500 font-bold underline underline-offset-4",
              day_outside: "text-slate-300 opacity-50",
              day_disabled: "text-slate-300 opacity-50",
              day_range_middle: "!bg-rose-50 !text-rose-600 !rounded-none",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
              IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
            }}
            footer={footer}
          />

          <style
            dangerouslySetInnerHTML={{
              __html: `
            .rdp-custom {
                --rdp-cell-size: 32px;
                --rdp-accent-color: #f43f5e;
                --rdp-background-color: #fff1f2;
                margin: 0;
            }
            .rdp-months {
                justify-content: center;
            }
          `,
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
};
