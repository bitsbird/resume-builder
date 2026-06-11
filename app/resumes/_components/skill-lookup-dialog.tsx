'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Muted } from '@/components/ui/typography';
import type { Skill } from '@/lib/skills';

interface SkillLookupDialogProps {
  isOpen: boolean;
  availableSkills: Skill[];
  onLink: (skill: Skill) => void;
  onClose: () => void;
}

export function SkillLookupDialog({ isOpen, availableSkills, onLink, onClose }: SkillLookupDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add saved skill</DialogTitle>
        </DialogHeader>
        {availableSkills.length === 0 ? (
          <Muted testId="skill-lookup-empty">
            All saved skills are already in this section.
          </Muted>
        ) : (
          <div className="flex flex-col gap-2">
            {availableSkills.map((skill) => (
              <Button
                key={skill.id}
                type="button"
                variant="outline"
                className="justify-start"
                onClick={() => { onLink(skill); onClose(); }}
              >
                {skill.name}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
