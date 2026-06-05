'use client';

import { useState } from 'react';

import {
  checkAccomplishmentIsOrphanedAction,
  listAccomplishmentsForWeAction,
  listAllWorkExperiencesAction,
} from '@/app/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { generateId, swapItems } from '@/lib/utils';
import type { Accomplishment } from '@/lib/accomplishments';
import type { WorkExperienceWithAccomplishments } from '@/lib/resumes';
import type { CreateWorkExperienceInput } from '@/lib/work-experiences';
import { AccomplishmentLookupDialog } from './accomplishment-lookup-dialog';
import type { EditorAccomplishment, EditorWorkExperience } from './editor-types';
import { WorkExperienceItem } from './work-experience-item';
import { WorkExperienceLookupDialog } from './work-experience-lookup-dialog';

interface WorkExperienceSectionProps {
  workExperiences: EditorWorkExperience[];
  resumeId?: number;
  onChange: (wes: EditorWorkExperience[]) => void;
  onAccomplishmentsToDeleteChange?: (ids: number[]) => void;
}

export function WorkExperienceSection({
  workExperiences,
  resumeId,
  onChange,
  onAccomplishmentsToDeleteChange,
}: WorkExperienceSectionProps) {
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [fetchedWorkExperiences, setFetchedWorkExperiences] = useState<WorkExperienceWithAccomplishments[]>([]);
  const [accLookupWeLocalId, setAccLookupWeLocalId] = useState<string | null>(null);
  const [fetchedAccomplishments, setFetchedAccomplishments] = useState<Accomplishment[]>([]);
  const [pendingDeleteAcc, setPendingDeleteAcc] = useState<{ localId: string; accId: number } | null>(null);
  const [accomplishmentsToDelete, setAccomplishmentsToDelete] = useState<number[]>([]);

  const accLookupWe = accLookupWeLocalId
    ? workExperiences.find((we) => we.localId === accLookupWeLocalId) ?? null
    : null;

  const linkedIds = new Set(
    workExperiences
      .filter((we): we is Extract<EditorWorkExperience, { type: 'existing' }> => we.type === 'existing')
      .map((we) => we.id),
  );
  const savedWorkExperiences = fetchedWorkExperiences.filter((we) => !linkedIds.has(we.id));

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
      accomplishments: [],
    };
    onChange([...workExperiences, newWe]);
  }

  function addExisting(we: WorkExperienceWithAccomplishments) {
    const { id, accomplishments, ...data } = we;
    const editorAccomplishments: EditorAccomplishment[] = accomplishments.map((acc) => ({
      type: 'existing',
      localId: generateId(),
      id: acc.id,
      content: acc.content,
    }));
    onChange([...workExperiences, { type: 'existing', localId: generateId(), id, data, accomplishments: editorAccomplishments }]);
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

  async function openAccomplishmentLookup(localId: string, weId: number) {
    const accs = await listAccomplishmentsForWeAction(weId);
    setFetchedAccomplishments(accs);
    setAccLookupWeLocalId(localId);
  }

  function linkAccomplishment(localId: string, acc: Accomplishment) {
    const newAcc: EditorAccomplishment = { type: 'existing', localId: generateId(), id: acc.id, content: acc.content };
    onChange(
      workExperiences.map((we) =>
        we.localId === localId ? { ...we, accomplishments: [...we.accomplishments, newAcc] } : we,
      ),
    );
  }

  function unlinkAccomplishment(localId: string, accId: number) {
    onChange(
      workExperiences.map((we) =>
        we.localId === localId
          ? { ...we, accomplishments: we.accomplishments.filter((a) => !(a.type === 'existing' && a.id === accId)) }
          : we,
      ),
    );
  }

  async function handleUnlinkRequested(localId: string, accId: number) {
    const isOrphaned = await checkAccomplishmentIsOrphanedAction(accId, resumeId);
    if (isOrphaned) {
      setPendingDeleteAcc({ localId, accId });
    } else {
      unlinkAccomplishment(localId, accId);
    }
  }

  function confirmPermanentDelete() {
    if (!pendingDeleteAcc) return;
    const { localId, accId } = pendingDeleteAcc;
    unlinkAccomplishment(localId, accId);
    const updated = [...accomplishmentsToDelete, accId];
    setAccomplishmentsToDelete(updated);
    onAccomplishmentsToDeleteChange?.(updated);
    setPendingDeleteAcc(null);
  }

  function cancelPermanentDelete() {
    setPendingDeleteAcc(null);
  }

  function addAccomplishment(localId: string, content: string) {
    const newAcc: EditorAccomplishment = { type: 'new', localId: generateId(), content };
    onChange(
      workExperiences.map((we) =>
        we.localId === localId
          ? { ...we, accomplishments: [...we.accomplishments, newAcc] }
          : we,
      ),
    );
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
          onAddAccomplishment={(content) => addAccomplishment(we.localId, content)}
          onOpenAccomplishmentLookup={
            we.type === 'existing' ? () => openAccomplishmentLookup(we.localId, we.id) : undefined
          }
        />
      ))}

      <WorkExperienceLookupDialog
        isOpen={isLookupOpen}
        savedWorkExperiences={savedWorkExperiences}
        onAdd={addExisting}
        onClose={() => setIsLookupOpen(false)}
      />

      <AccomplishmentLookupDialog
        isOpen={accLookupWeLocalId !== null}
        allAccomplishments={fetchedAccomplishments}
        selectedAccomplishments={accLookupWe?.accomplishments ?? []}
        onLink={(acc) => accLookupWeLocalId && linkAccomplishment(accLookupWeLocalId, acc)}
        onUnlink={(accId) => accLookupWeLocalId && handleUnlinkRequested(accLookupWeLocalId, accId)}
        onClose={() => setAccLookupWeLocalId(null)}
      />

      <AlertDialog open={pendingDeleteAcc !== null} onOpenChange={(open) => { if (!open) cancelPermanentDelete(); }}>
        <AlertDialogContent data-testid="acc-delete-confirm-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently delete accomplishment?</AlertDialogTitle>
            <AlertDialogDescription>
              This accomplishment is not used in any other resume. Deleting it will remove it permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="acc-delete-cancel" onClick={cancelPermanentDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction data-testid="acc-delete-confirm" onClick={confirmPermanentDelete}>
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
