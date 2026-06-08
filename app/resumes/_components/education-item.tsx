'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateEducationInput } from '@/lib/educations';
import type { EditorEducation } from './editor-types';

interface EducationItemProps {
  edu: EditorEducation;
  onChange: (data: CreateEducationInput) => void;
  onRemove: () => void;
}

export function EducationItem({ edu, onChange, onRemove }: EducationItemProps) {
  const data = edu.data;

  function update(patch: Partial<CreateEducationInput>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div data-testid="edu-item" className="flex flex-col gap-2 rounded border border-gray-200 p-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          data-testid="edu-remove"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label>Degree</Label>
          <Input
            value={data.degree}
            onChange={(e) => update({ degree: e.target.value })}
            placeholder="e.g. BSc Computer Science"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Institution</Label>
          <Input
            value={data.institution}
            onChange={(e) => update({ institution: e.target.value })}
            placeholder="e.g. MIT"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Start date</Label>
          <Input
            value={data.startDate}
            onChange={(e) => update({ startDate: e.target.value })}
            placeholder="YYYY-MM"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>End date</Label>
          <Input
            value={data.endDate ?? ''}
            onChange={(e) => update({ endDate: e.target.value || null })}
            placeholder="YYYY-MM (leave blank if current)"
          />
        </div>
      </div>
    </div>
  );
}
