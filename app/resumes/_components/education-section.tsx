'use client';

import { useState } from 'react';

import { listAllEducationAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import type { Education } from '@/lib/educations';
import { generateId } from '@/lib/utils';
import type { EditorEducation } from './editor-types';
import { EducationItem } from './education-item';
import { EducationLookupDialog } from './education-lookup-dialog';
import type { CreateEducationInput } from '@/lib/educations';

interface EducationSectionProps {
  education: EditorEducation[];
  onChange: (education: EditorEducation[]) => void;
}

export function EducationSection({ education, onChange }: EducationSectionProps) {
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [fetchedEducation, setFetchedEducation] = useState<Education[]>([]);

  const linkedIds = new Set(
    education
      .filter((e): e is Extract<EditorEducation, { type: 'existing' }> => e.type === 'existing')
      .map((e) => e.id),
  );
  const savedEducation = fetchedEducation.filter((e) => !linkedIds.has(e.id));

  async function openLookup() {
    const all = await listAllEducationAction();
    setFetchedEducation(all);
    setIsLookupOpen(true);
  }

  function addNew() {
    const newEntry: EditorEducation = {
      type: 'new',
      localId: generateId(),
      data: { degree: '', institution: '', startDate: '', endDate: null },
    };
    onChange([...education, newEntry]);
  }

  function addExisting(edu: Education) {
    const { id, ...data } = edu;
    const entry: EditorEducation = {
      type: 'existing',
      localId: generateId(),
      id,
      data: { degree: data.degree, institution: data.institution, startDate: data.startDate, endDate: data.endDate },
    };
    onChange([...education, entry]);
  }

  function remove(localId: string) {
    onChange(education.filter((e) => e.localId !== localId));
  }

  function update(localId: string, data: CreateEducationInput) {
    onChange(education.map((e) => (e.localId === localId ? { ...e, data } : e)));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Education</h3>
        <Button type="button" variant="outline" size="sm" data-testid="edu-add-new" onClick={addNew}>
          +
        </Button>
        <Button type="button" variant="outline" size="sm" data-testid="edu-lookup-trigger" onClick={openLookup}>
          Add saved
        </Button>
      </div>

      {education.map((e) => (
        <EducationItem
          key={e.localId}
          edu={e}
          onChange={(data) => update(e.localId, data)}
          onRemove={() => remove(e.localId)}
        />
      ))}

      <EducationLookupDialog
        isOpen={isLookupOpen}
        savedEducation={savedEducation}
        onAdd={addExisting}
        onClose={() => setIsLookupOpen(false)}
      />
    </div>
  );
}
