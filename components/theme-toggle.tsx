'use client';

import * as React from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type ThemePreference, useTheme } from '@/components/theme-provider';

const themeOptions: Array<{
  icon: typeof Sun;
  label: string;
  value: ThemePreference;
}> = [
  { icon: Sun, label: 'Light', value: 'light' },
  { icon: Moon, label: 'Dark', value: 'dark' },
  { icon: Monitor, label: 'System', value: 'system' },
];

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const activeTheme = themeOptions.find((option) => option.value === theme) ?? themeOptions[2];
  const ActiveIcon = activeTheme.value === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Theme: ${activeTheme.label}`}
        className="h-9 gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
        onClick={() => setIsOpen((current) => !current)}
      >
        <ActiveIcon className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{activeTheme.label}</span>
      </Button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Theme"
          className="absolute right-0 top-11 z-50 w-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl shadow-black/20"
        >
          {themeOptions.map((option) => {
            const OptionIcon = option.icon;
            const isSelected = option.value === theme;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
              >
                <span className="flex items-center gap-2">
                  <OptionIcon className="h-4 w-4" aria-hidden="true" />
                  {option.label}
                </span>
                {isSelected ? <Check className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
