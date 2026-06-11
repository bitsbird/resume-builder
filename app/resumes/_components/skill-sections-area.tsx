'use client';

import { Button } from '@/components/ui/button';
import { H3 } from '@/components/ui/typography';
import type { Skill } from '@/lib/skills';
import { generateId } from '@/lib/utils';
import type { EditorSkillSection } from './editor-types';
import { SkillSectionItem } from './skill-section-item';

interface SkillSectionsAreaProps {
  sections: EditorSkillSection[];
  allSkills: Skill[];
  onChange: (sections: EditorSkillSection[]) => void;
}

export function SkillSectionsArea({ sections, allSkills, onChange }: SkillSectionsAreaProps) {
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
        <H3>Skill Sections</H3>
        <Button type="button" variant="outline" size="sm" data-testid="skill-section-add" onClick={addSection}>
          + Add section
        </Button>
      </div>

      {sections.map((section) => (
        <SkillSectionItem
          key={section.localId}
          section={section}
          allSkills={allSkills}
          onChange={(updated) => updateSection(section.localId, updated)}
          onRemove={() => removeSection(section.localId)}
        />
      ))}
    </div>
  );
}
