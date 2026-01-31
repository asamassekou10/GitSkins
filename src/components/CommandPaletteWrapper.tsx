'use client';

import { useState, useEffect } from 'react';
import { CommandPalette } from '@/components/CommandPalette';

export function CommandPaletteWrapper() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    const handleOpen = () => setOpen(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpen);
    };
  }, []);

  return <CommandPalette open={open} onClose={() => setOpen(false)} />;
}
