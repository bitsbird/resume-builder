'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { WorkExperience } from '@/lib/work-experiences';

interface WorkExperienceLookupDialogProps {
  isOpen: boolean;
  available: WorkExperience[];
  onAdd: (we: WorkExperience) => void;
  onClose: () => void;
}

export function WorkExperienceLookupDialog({
  isOpen,
  available,
  onAdd,
  onClose,
}: WorkExperienceLookupDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add existing work experience</DialogTitle>
        </DialogHeader>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="we-lookup-close"
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          Close
        </Button>
        {available.length === 0 ? (
          <p data-testid="we-lookup-empty" className="text-sm text-gray-500">
            No saved work experiences available to add.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {available.map((we) => (
              <Card key={we.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{we.employer}</p>
                    <p className="text-sm text-gray-600">{we.role}</p>
                    <p className="text-xs text-gray-500">
                      {we.startDate}
                      {we.endDate ? ` – ${we.endDate}` : ' – present'} · {we.location}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    data-testid="we-lookup-add"
                    onClick={() => { onAdd(we); onClose(); }}
                  >
                    Add
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
