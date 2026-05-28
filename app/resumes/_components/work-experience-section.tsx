'use client';

import { useState } from 'react';

import { listAllWorkExperiencesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { generateId, swapItems } from '@/lib/utils';
import type { CreateWorkExperienceInput, WorkExperience } from '@/lib/work-experiences';
import type { EditorWorkExperience } from './editor-types';
import { WorkExperienceItem } from './work-experience-item';
import { WorkExperienceLookupDialog } from './work-experience-lookup-dialog';

interface WorkExperienceSectionProps {
  workExperiences: EditorWorkExperience[];
  onChange: (wes: EditorWorkExperience[]) => void;
}

export function WorkExperienceSection({ workExperiences, onChange }: WorkExperienceSectionProps) {
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [fetchedWorkExperiences, setFetchedWorkExperiences] = useState<WorkExperience[]>([]);

  const linkedIds = new Set(
    workExperiences
      .filter((we): we is Extract<EditorWorkExperience, { type: 'existing' }> => we.type === 'existing')
      .map((we) => we.id),
  );
  const available = fetchedWorkExperiences.filter((we) => !linkedIds.has(we.id));

  async function openLookup() {
    const all = await listAllWorkExperiencesAction();
    setFetchedWorkExperiences(all);
    setIsLookupOpen(true);
  }

  function addNew() {
    const newWe: EditorWorkExperience = {
      type: 'new',
      localId: generateId(),
      data: { employer: '', role: '', startDate: '', endDate: null, location: '', header: null },
    };
    onChange([...workExperiences, newWe]);
  }

  function addExisting(we: WorkExperience) {
    const { id, ...data } = we;
    onChange([...workExperiences, { type: 'existing', localId: generateId(), id, data }]);
  }

  function remove(localId: string) {
    onChange(workExperiences.filter((we) => we.localId !== localId));
  }

  function update(localId: string, data: CreateWorkExperienceInput) {
    onChange(workExperiences.map((we) => (we.localId === localId ? { ...we, data } : we)));
  }

  function moveUp(localId: string) {
    const idx = workExperiences.findIndex((we) => we.localId === localId);
    if (idx <= 0) return;
    onChange(swapItems(workExperiences, idx - 1, idx));
  }

  function moveDown(localId: string) {
    const idx = workExperiences.findIndex((we) => we.localId === localId);
    if (idx < 0 || idx >= workExperiences.length - 1) return;
    onChange(swapItems(workExperiences, idx, idx + 1));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Work Experience</h3>
        <Button type="button" variant="outline" size="sm" data-testid="we-add-new" onClick={addNew}>
          +
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="we-lookup-trigger"
          onClick={openLookup}
        >
          Add saved
        </Button>
      </div>

      {workExperiences.map((we, idx) => (
        <WorkExperienceItem
          key={we.localId}
          we={we}
          isFirst={idx === 0}
          isLast={idx === workExperiences.length - 1}
          onChange={(data) => update(we.localId, data)}
          onRemove={() => remove(we.localId)}
          onMoveUp={() => moveUp(we.localId)}
          onMoveDown={() => moveDown(we.localId)}
        />
      ))}

      <WorkExperienceLookupDialog
        isOpen={isLookupOpen}
        available={available}
        onAdd={addExisting}
        onClose={() => setIsLookupOpen(false)}
      />
    </div>
  );
}
