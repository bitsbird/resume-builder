import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { EditorWorkExperience } from '@/app/resumes/_components/editor-types';
import { useResumeEditorForm } from '@/app/resumes/_components/use-resume-editor-form';

const newWorkExperience: EditorWorkExperience = {
  type: 'new',
  localId: 'local-1',
  data: { employer: 'Acme', role: 'Engineer', startDate: '2020-01', endDate: null, location: 'Remote', header: null },
  accomplishments: [],
};

describe('useResumeEditorForm', () => {
  it('initialises with empty defaults when called with no arguments', () => {
    const { result } = renderHook(() => useResumeEditorForm());

    expect(result.current.title).toBe('');
    expect(result.current.targetRole).toBe('');
    expect(result.current.targetCompany).toBe('');
    expect(result.current.workExperiences).toEqual([]);
    expect(result.current.skillSections).toEqual([]);
    expect(result.current.education).toEqual([]);
    expect(result.current.accomplishmentsToDelete).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('initialises with provided values', () => {
    const { result } = renderHook(() =>
      useResumeEditorForm({
        title: 'My CV',
        targetRole: 'Staff Engineer',
        targetCompany: 'Acme',
        workExperiences: [newWorkExperience],
      }),
    );

    expect(result.current.title).toBe('My CV');
    expect(result.current.targetRole).toBe('Staff Engineer');
    expect(result.current.targetCompany).toBe('Acme');
    expect(result.current.workExperiences).toEqual([newWorkExperience]);
  });

  it('updates title via setTitle', () => {
    const { result } = renderHook(() => useResumeEditorForm());

    act(() => result.current.setTitle('Updated Title'));

    expect(result.current.title).toBe('Updated Title');
  });

  it('updates error via setError', () => {
    const { result } = renderHook(() => useResumeEditorForm());

    act(() => result.current.setError('Something went wrong'));

    expect(result.current.error).toBe('Something went wrong');
  });
});
