'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Muted, Small } from '@/components/ui/typography';
import type { WorkExperienceWithAccomplishments } from '@/lib/resumes';

interface WorkExperienceLookupDialogProps {
  isOpen: boolean;
  savedWorkExperiences: WorkExperienceWithAccomplishments[];
  onAdd: (we: WorkExperienceWithAccomplishments) => void;
  onClose: () => void;
}

export function WorkExperienceLookupDialog({
  isOpen,
  savedWorkExperiences,
  onAdd,
  onClose,
}: WorkExperienceLookupDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add existing work experience</DialogTitle>
        </DialogHeader>
{savedWorkExperiences.length === 0 ? (
          <Muted testId="we-lookup-empty">No saved work experiences available to add.</Muted>
        ) : (
          <div className="flex flex-col gap-3">
            {savedWorkExperiences.map((we) => (
              <Card key={we.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <div>
                      <Small>{we.employer}</Small>
                    </div>
                    <div>
                      <Small>{we.role}</Small>
                    </div>
                    <div>
                      <Small>
                        {we.startDate}
                        {we.endDate ? ` – ${we.endDate}` : ' – present'} · {we.location}
                      </Small>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    data-testid="we-lookup-add"
                    onClick={() => {
                      onAdd(we);
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
