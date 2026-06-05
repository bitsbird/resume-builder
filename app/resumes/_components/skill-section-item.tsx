'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Skill } from '@/lib/skills';
import { generateId } from '@/lib/utils';
import type { EditorSkill, EditorSkillSection } from './editor-types';
import { SkillLookupDialog } from './skill-lookup-dialog';

interface SkillSectionItemProps {
  section: EditorSkillSection;
  allSkills: Skill[];
  onChange: (section: EditorSkillSection) => void;
  onRemove: () => void;
}

function isValidSkillName(name: string): boolean {
  return name.trim().split(/\s+/).length <= 2;
}

export function SkillSectionItem({ section, allSkills, onChange, onRemove }: SkillSectionItemProps) {
  const [skillDraft, setSkillDraft] = useState('');
  const [skillNameError, setSkillNameError] = useState<string | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  const sectionSkillIds = new Set(
    section.skills
      .filter((s): s is Extract<EditorSkill, { type: 'existing' }> => s.type === 'existing')
      .map((s) => s.id),
  );
  const availableSkills = allSkills.filter((s) => !sectionSkillIds.has(s.id));

  function handleLinkSkill(skill: Skill) {
    const linked: EditorSkill = { type: 'existing', localId: generateId(), id: skill.id, name: skill.name };
    onChange({ ...section, skills: [...section.skills, linked] });
  }

  function handleTitleChange(title: string) {
    onChange({ ...section, title });
  }

  function handleAddSkill() {
    const trimmed = skillDraft.trim();
    if (!trimmed) return;

    if (!isValidSkillName(trimmed)) {
      setSkillNameError('Skill must be 1–2 words');
      return;
    }

    setSkillNameError(null);
    const newSkill: EditorSkill = { type: 'new', localId: generateId(), name: trimmed };
    onChange({ ...section, skills: [...section.skills, newSkill] });
    setSkillDraft('');
  }

  function handleRemoveSkill(localId: string) {
    onChange({ ...section, skills: section.skills.filter((s) => s.localId !== localId) });
  }

  return (
    <div data-testid="skill-section-item" className="flex flex-col gap-3 rounded border border-gray-200 p-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          data-testid="skill-section-title"
          value={section.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Section name (e.g. Tech Skills)"
          className="max-w-xs"
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          data-testid="skill-section-delete"
          onClick={onRemove}
        >
          Delete
        </Button>
      </div>

      {section.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {section.skills.map((skill) => (
            <Badge key={skill.localId} data-testid={`skill-chip-${skill.localId}`} variant="secondary" className="gap-1">
              {skill.name}
              <button
                type="button"
                data-testid={`skill-remove-${skill.localId}`}
                onClick={() => handleRemoveSkill(skill.localId)}
                className="ml-1 text-xs leading-none hover:text-destructive"
                aria-label={`Remove ${skill.name}`}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <Input
            data-testid="skill-name-input"
            value={skillDraft}
            onChange={(e) => {
              setSkillDraft(e.target.value);
              setSkillNameError(null);
            }}
            placeholder="Add skill (1–2 words)"
            className="max-w-xs"
          />
          <Button type="button" variant="outline" size="sm" data-testid="skill-add" onClick={handleAddSkill}>
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-testid="skill-lookup-open"
            onClick={() => setIsLookupOpen(true)}
          >
            Add saved skill
          </Button>
        </div>
        {skillNameError && (
          <p data-testid="skill-name-error" className="text-sm text-red-600">
            {skillNameError}
          </p>
        )}
      </div>

      <SkillLookupDialog
        isOpen={isLookupOpen}
        availableSkills={availableSkills}
        onLink={handleLinkSkill}
        onClose={() => setIsLookupOpen(false)}
      />
    </div>
  );
}
