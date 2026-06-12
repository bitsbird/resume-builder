'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

interface PersistentFormWrapperProps {
  children: ReactNode;
  onSave: () => void;
  onCancel: () => void;
  saveTestId?: string;
  cancelTestId?: string;
}

export function PersistentFormWrapper({
  children,
  onSave,
  onCancel,
  saveTestId,
  cancelTestId,
}: PersistentFormWrapperProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="-mx-(--layout-padding) -mb-(--layout-padding) flex shrink-0 justify-center gap-2 border-t px-6 py-4">
        <Button variant="outline" data-testid={cancelTestId} onClick={onCancel}>
          Cancel
        </Button>
        <Button data-testid={saveTestId} onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
