'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateWorkExperienceInput } from '@/lib/work-experiences';
import type { EditorWorkExperience } from './editor-types';

interface WorkExperienceItemProps {
  we: EditorWorkExperience;
  isFirst: boolean;
  isLast: boolean;
  onChange: (data: CreateWorkExperienceInput) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function WorkExperienceItem({
  we,
  isFirst,
  isLast,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: WorkExperienceItemProps) {
  const data = we.data;

  function update(patch: Partial<CreateWorkExperienceInput>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div data-testid="we-item" className="flex flex-col gap-2 rounded border border-gray-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="we-move-up"
            disabled={isFirst}
            onClick={onMoveUp}
          >
            ↑
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="we-move-down"
            disabled={isLast}
            onClick={onMoveDown}
          >
            ↓
          </Button>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          data-testid="we-remove"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label>Employer</Label>
          <Input
            value={data.employer}
            onChange={(e) => update({ employer: e.target.value })}
            placeholder="Employer"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Role</Label>
          <Input
            value={data.role}
            onChange={(e) => update({ role: e.target.value })}
            placeholder="Role"
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
        <div className="flex flex-col gap-1">
          <Label>Location</Label>
          <Input
            value={data.location}
            onChange={(e) => update({ location: e.target.value })}
            placeholder="Location"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Header</Label>
          <Input
            value={data.header ?? ''}
            onChange={(e) => update({ header: e.target.value || null })}
            placeholder="Optional section header"
          />
        </div>
      </div>
    </div>
  );
}
