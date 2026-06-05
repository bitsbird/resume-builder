'use client';

import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils';
import type { EditorSkillSection } from './editor-types';
import { SkillSectionItem } from './skill-section-item';

interface SkillSectionsAreaProps {
  sections: EditorSkillSection[];
  onChange: (sections: EditorSkillSection[]) => void;
}

export function SkillSectionsArea({ sections, onChange }: SkillSectionsAreaProps) {
  function addSection() {
    const newSection: EditorSkillSection = {
      type: 'new',
      localId: generateId(),
      title: '',
      skills: [],
    };
    onChange([...sections, newSection]);
  }

  function updateSection(localId: string, updated: EditorSkillSection) {
    onChange(sections.map((s) => (s.localId === localId ? updated : s)));
  }

  function removeSection(localId: string) {
    onChange(sections.filter((s) => s.localId !== localId));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Skill Sections</h3>
        <Button type="button" variant="outline" size="sm" data-testid="skill-section-add" onClick={addSection}>
          + Add section
        </Button>
      </div>

      {sections.map((section) => (
        <SkillSectionItem
          key={section.localId}
          section={section}
          onChange={(updated) => updateSection(section.localId, updated)}
          onRemove={() => removeSection(section.localId)}
        />
      ))}
    </div>
  );
}
