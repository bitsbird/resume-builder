'use client';

import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Muted } from '@/components/ui/typography';
import type { Accomplishment } from '@/lib/accomplishments';
import type { EditorAccomplishment } from './editor-types';

const maxAccomplishments = 5;

interface AccomplishmentLookupDialogProps {
  isOpen: boolean;
  allAccomplishments: Accomplishment[];
  selectedAccomplishments: EditorAccomplishment[];
  onLink: (acc: Accomplishment) => void;
  onUnlink: (accId: number) => void;
  onClose: () => void;
}

export function AccomplishmentLookupDialog({
  isOpen,
  allAccomplishments,
  selectedAccomplishments,
  onLink,
  onUnlink,
  onClose,
}: AccomplishmentLookupDialogProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedIds = new Set(
    selectedAccomplishments
      .filter((a): a is Extract<EditorAccomplishment, { type: 'existing' }> => a.type === 'existing')
      .map((a) => a.id),
  );

  function handleCheckedChange(acc: Accomplishment, isChecked: boolean) {
    if (isChecked) {
      if (selectedAccomplishments.length >= maxAccomplishments) {
        setValidationError('Maximum of 5 accomplishments per work experience');
        return;
      }
      setValidationError(null);
      onLink(acc);
    } else {
      setValidationError(null);
      onUnlink(acc.id);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Browse accomplishments</DialogTitle>
        </DialogHeader>
        {allAccomplishments.length === 0 ? (
          <Muted testId="acc-lookup-empty">
            No accomplishments found for this work experience.
          </Muted>
        ) : (
          <div className="flex flex-col gap-2">
            {validationError && (
              <p data-testid="acc-lookup-error" className="text-sm text-red-600">
                {validationError}
              </p>
            )}
            {allAccomplishments.map((acc) => {
              const checkboxId = `acc-lookup-${acc.id}`;
              return (
                <div key={acc.id} className="flex items-center gap-2">
                  <Checkbox
                    id={checkboxId}
                    data-testid="acc-lookup-checkbox"
                    checked={selectedIds.has(acc.id)}
                    onCheckedChange={(isChecked) => handleCheckedChange(acc, isChecked === true)}
                  />
                  <Label htmlFor={checkboxId}>{acc.content}</Label>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
