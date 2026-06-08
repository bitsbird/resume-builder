'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Education } from '@/lib/educations';

interface EducationLookupDialogProps {
  isOpen: boolean;
  savedEducation: Education[];
  onAdd: (edu: Education) => void;
  onClose: () => void;
}

export function EducationLookupDialog({
  isOpen,
  savedEducation,
  onAdd,
  onClose,
}: EducationLookupDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add existing education</DialogTitle>
        </DialogHeader>
        {savedEducation.length === 0 ? (
          <p data-testid="edu-lookup-empty" className="text-sm text-gray-500">
            No saved education entries available to add.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {savedEducation.map((edu) => (
              <Card key={edu.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">
                      {edu.startDate}
                      {edu.endDate ? ` – ${edu.endDate}` : ' – present'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    data-testid="edu-lookup-add"
                    onClick={() => { onAdd(edu); onClose(); }}
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
