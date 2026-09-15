'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TEMPLATES, defaultTemplateId } from '@/lib/templates';

interface TemplateSelectorBarProps {
  resumeId: number;
}

export function TemplateSelectorBar({ resumeId }: TemplateSelectorBarProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplateId);

  return (
    <div className="flex items-center gap-4">
      <Label htmlFor="template-select">Preview template:</Label>
      <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
        <SelectTrigger id="template-select" className="w-48">
          <SelectValue>{TEMPLATES[selectedTemplateId]?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(TEMPLATES).map(([id, { label }]) => (
            <SelectItem key={id} value={id}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button asChild>
        <Link href={`/resumes/${resumeId}/preview?templateId=${selectedTemplateId}`}>Preview</Link>
      </Button>
    </div>
  );
}
