'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { H5, Muted, Small } from '@/components/ui/typography';
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add existing education</DialogTitle>
        </DialogHeader>
        {savedEducation.length === 0 ? (
          <Muted testId="edu-lookup-empty">No saved education entries available to add.</Muted>
        ) : (
          <div className="flex flex-col gap-3">
            {savedEducation.map((edu) => (
              <Card key={edu.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <div>
                      <H5 className="mb-2">{edu.degree}</H5>
                    </div>
                    <div>
                      <Small>{edu.institution}</Small>
                    </div>
                    <div>
                      <Small>
                        {edu.startDate}
                        {edu.endDate ? ` – ${edu.endDate}` : ' – present'}
                      </Small>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    data-testid="edu-lookup-add"
                    onClick={() => {
                      onAdd(edu);
                      onClose();
                    }}
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
