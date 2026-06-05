'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateId } from '@/lib/utils';
import type { EditorSkill, EditorSkillSection } from './editor-types';

interface SkillSectionItemProps {
  section: EditorSkillSection;
  onChange: (section: EditorSkillSection) => void;
  onRemove: () => void;
}

function isValidSkillName(name: string): boolean {
  return name.trim().split(/\s+/).length <= 2;
}

export function SkillSectionItem({ section, onChange, onRemove }: SkillSectionItemProps) {
  const [skillDraft, setSkillDraft] = useState('');
  const [skillNameError, setSkillNameError] = useState<string | null>(null);

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
        </div>
        {skillNameError && (
          <p data-testid="skill-name-error" className="text-sm text-red-600">
            {skillNameError}
          </p>
        )}
      </div>
    </div>
  );
}
