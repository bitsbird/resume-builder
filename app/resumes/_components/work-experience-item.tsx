'use client';

import { useState } from 'react';

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
  onAddAccomplishment: (content: string) => void;
  onOpenAccomplishmentLookup?: () => void;
}

export function WorkExperienceItem({
  we,
  isFirst,
  isLast,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddAccomplishment,
  onOpenAccomplishmentLookup,
}: WorkExperienceItemProps) {
  const data = we.data;
  const [accomplishmentDraft, setAccomplishmentDraft] = useState('');

  function update(patch: Partial<CreateWorkExperienceInput>) {
    onChange({ ...data, ...patch });
  }

  function handleAddAccomplishment() {
    if (!accomplishmentDraft.trim()) return;
    onAddAccomplishment(accomplishmentDraft.trim());
    setAccomplishmentDraft('');
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

      {we.accomplishments.length > 0 && (
        <ul className="flex flex-col gap-1">
          {we.accomplishments.map((acc) => (
            <li key={acc.localId} data-testid="accomplishment-item" className="text-sm">
              {acc.content}
            </li>
          ))}
        </ul>
      )}

      {we.type === 'existing' && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="acc-lookup-trigger"
          onClick={onOpenAccomplishmentLookup}
        >
          Browse accomplishments
        </Button>
      )}

      <div className="flex gap-2">
        <Input
          data-testid="accomplishment-input"
          value={accomplishmentDraft}
          onChange={(e) => setAccomplishmentDraft(e.target.value)}
          placeholder="Add accomplishment"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="accomplishment-add"
          onClick={handleAddAccomplishment}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
