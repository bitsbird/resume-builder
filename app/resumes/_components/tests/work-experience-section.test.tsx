import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { WorkExperienceSection } from '@/app/resumes/_components/work-experience-section';
import {
  listAllWorkExperiencesAction,
  listAccomplishmentsForWeAction,
  checkAccomplishmentIsOrphanedAction,
} from '@/app/actions';
import type { EditorWorkExperience } from '@/app/resumes/_components/editor-types';
import type { WorkExperienceWithAccomplishments } from '@/lib/resumes';
import type { Accomplishment } from '@/lib/accomplishments';

vi.mock('@/app/actions', () => ({
  listAllWorkExperiencesAction: vi.fn(),
  listAccomplishmentsForWeAction: vi.fn(),
  checkAccomplishmentIsOrphanedAction: vi.fn(),
}));

const existingWe: WorkExperienceWithAccomplishments = {
  id: 10,
  employer: 'Saved Co',
  role: 'Dev',
  startDate: '2019-01',
  endDate: null,
  location: 'Remote',
  header: null,
  accomplishments: [],
};

const editorWe: EditorWorkExperience = {
  type: 'existing',
  localId: 'local-1',
  id: 10,
  data: {
    employer: existingWe.employer,
    role: existingWe.role,
    startDate: existingWe.startDate,
    endDate: existingWe.endDate,
    location: existingWe.location,
    header: existingWe.header,
  },
  accomplishments: [],
};

beforeEach(() => {
  vi.mocked(listAllWorkExperiencesAction).mockResolvedValue([]);
  vi.mocked(listAccomplishmentsForWeAction).mockResolvedValue([]);
  vi.mocked(checkAccomplishmentIsOrphanedAction).mockResolvedValue(false);
});

describe('WorkExperienceSection', () => {
  it('renders existing work experiences', () => {
    render(
      <WorkExperienceSection workExperiences={[editorWe]} onChange={vi.fn()} />,
    );
    expect(screen.getByDisplayValue('Saved Co')).toBeInTheDocument();
  });

  it('renders an empty section with no work experiences', () => {
    render(
      <WorkExperienceSection workExperiences={[]} onChange={vi.fn()} />,
    );
    expect(screen.queryAllByTestId('we-item')).toHaveLength(0);
    expect(screen.getByTestId('we-add-new')).toBeInTheDocument();
    expect(screen.getByTestId('we-lookup-trigger')).toBeInTheDocument();
  });

  it('adds a blank work experience when the + button is clicked', () => {
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('we-add-new'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ type: 'new' })]),
    );
  });

  it('fetches and shows available WEs when the lookup button is clicked', async () => {
    vi.mocked(listAllWorkExperiencesAction).mockResolvedValue([existingWe]);
    render(<WorkExperienceSection workExperiences={[]} onChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId('we-lookup-trigger'));
    expect(await screen.findByText('Saved Co')).toBeInTheDocument();
  });

  it('filters already-linked WEs from the lookup results', async () => {
    vi.mocked(listAllWorkExperiencesAction).mockResolvedValue([existingWe]);
    render(<WorkExperienceSection workExperiences={[editorWe]} onChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId('we-lookup-trigger'));
    expect(await screen.findByTestId('we-lookup-empty')).toBeInTheDocument();
  });

  it('removes a work experience when remove is called', () => {
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[editorWe]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('we-remove'));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('adds an existing WE from the lookup', async () => {
    vi.mocked(listAllWorkExperiencesAction).mockResolvedValue([existingWe]);
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('we-lookup-trigger'));
    fireEvent.click(await screen.findByTestId('we-lookup-add'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ type: 'existing', id: existingWe.id })]),
    );
  });

  it('pre-loads accomplishments when adding a WE from the lookup', async () => {
    const weWithAccs: WorkExperienceWithAccomplishments = {
      ...existingWe,
      accomplishments: [{ id: 201, weId: existingWe.id, content: 'Shipped feature X' }],
    };
    vi.mocked(listAllWorkExperiencesAction).mockResolvedValue([weWithAccs]);
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('we-lookup-trigger'));
    fireEvent.click(await screen.findByTestId('we-lookup-add'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'existing',
          id: existingWe.id,
          accomplishments: expect.arrayContaining([
            expect.objectContaining({ type: 'existing', id: 201, content: 'Shipped feature X' }),
          ]),
        }),
      ]),
    );
  });

  it('appends a new accomplishment to the correct WE when onAddAccomplishment fires', () => {
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[editorWe]} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('accomplishment-input'), {
      target: { value: 'Shipped feature X' },
    });
    fireEvent.click(screen.getByTestId('accomplishment-add'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          localId: editorWe.localId,
          accomplishments: expect.arrayContaining([
            expect.objectContaining({ type: 'new', content: 'Shipped feature X' }),
          ]),
        }),
      ]),
    );
  });

  it('fetches accomplishments and opens the dialog when Browse is clicked on an existing WE', async () => {
    const acc: Accomplishment = { id: 201, weId: editorWe.id, content: 'Built platform' };
    vi.mocked(listAccomplishmentsForWeAction).mockResolvedValue([acc]);
    render(<WorkExperienceSection workExperiences={[editorWe]} onChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId('acc-lookup-trigger'));
    expect(await screen.findByLabelText('Built platform')).toBeInTheDocument();
  });

  it('links an accomplishment by adding it to the WE as type existing', async () => {
    const acc: Accomplishment = { id: 201, weId: editorWe.id, content: 'Built platform' };
    vi.mocked(listAccomplishmentsForWeAction).mockResolvedValue([acc]);
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[editorWe]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('acc-lookup-trigger'));
    fireEvent.click(await screen.findByLabelText('Built platform'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          localId: editorWe.localId,
          accomplishments: expect.arrayContaining([
            expect.objectContaining({ type: 'existing', id: acc.id, content: acc.content }),
          ]),
        }),
      ]),
    );
  });

  it('unlinks a non-orphaned accomplishment directly without a confirmation prompt', async () => {
    const linkedAcc: Accomplishment = { id: 201, weId: editorWe.id, content: 'Built platform' };
    const weWithAcc: EditorWorkExperience = {
      ...editorWe,
      accomplishments: [{ type: 'existing', localId: 'l-acc-1', id: linkedAcc.id, content: linkedAcc.content }],
    };
    vi.mocked(listAccomplishmentsForWeAction).mockResolvedValue([linkedAcc]);
    vi.mocked(checkAccomplishmentIsOrphanedAction).mockResolvedValue(false);
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[weWithAcc]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('acc-lookup-trigger'));
    fireEvent.click(await screen.findByLabelText('Built platform'));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ localId: editorWe.localId, accomplishments: [] }),
      ]),
    ));
    expect(screen.queryByTestId('acc-delete-confirm-dialog')).not.toBeInTheDocument();
  });

  it('shows a confirmation dialog before permanently removing an orphaned accomplishment', async () => {
    const linkedAcc: Accomplishment = { id: 201, weId: editorWe.id, content: 'Built platform' };
    const weWithAcc: EditorWorkExperience = {
      ...editorWe,
      accomplishments: [{ type: 'existing', localId: 'l-acc-1', id: linkedAcc.id, content: linkedAcc.content }],
    };
    vi.mocked(listAccomplishmentsForWeAction).mockResolvedValue([linkedAcc]);
    vi.mocked(checkAccomplishmentIsOrphanedAction).mockResolvedValue(true);
    render(<WorkExperienceSection workExperiences={[weWithAcc]} onChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId('acc-lookup-trigger'));
    fireEvent.click(await screen.findByLabelText('Built platform'));
    expect(await screen.findByTestId('acc-delete-confirm-dialog')).toBeInTheDocument();
  });

  it('does not unlink when the user cancels the permanent-deletion confirmation', async () => {
    const linkedAcc: Accomplishment = { id: 201, weId: editorWe.id, content: 'Built platform' };
    const weWithAcc: EditorWorkExperience = {
      ...editorWe,
      accomplishments: [{ type: 'existing', localId: 'l-acc-1', id: linkedAcc.id, content: linkedAcc.content }],
    };
    vi.mocked(listAccomplishmentsForWeAction).mockResolvedValue([linkedAcc]);
    vi.mocked(checkAccomplishmentIsOrphanedAction).mockResolvedValue(true);
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[weWithAcc]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('acc-lookup-trigger'));
    fireEvent.click(await screen.findByLabelText('Built platform'));
    fireEvent.click(await screen.findByTestId('acc-delete-cancel'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('unlinks and marks for permanent deletion when the user confirms', async () => {
    const linkedAcc: Accomplishment = { id: 201, weId: editorWe.id, content: 'Built platform' };
    const weWithAcc: EditorWorkExperience = {
      ...editorWe,
      accomplishments: [{ type: 'existing', localId: 'l-acc-1', id: linkedAcc.id, content: linkedAcc.content }],
    };
    vi.mocked(listAccomplishmentsForWeAction).mockResolvedValue([linkedAcc]);
    vi.mocked(checkAccomplishmentIsOrphanedAction).mockResolvedValue(true);
    const onChange = vi.fn();
    const onAccomplishmentsToDeleteChange = vi.fn();
    render(
      <WorkExperienceSection
        workExperiences={[weWithAcc]}
        onChange={onChange}
        onAccomplishmentsToDeleteChange={onAccomplishmentsToDeleteChange}
      />,
    );
    fireEvent.click(screen.getByTestId('acc-lookup-trigger'));
    fireEvent.click(await screen.findByLabelText('Built platform'));
    fireEvent.click(await screen.findByTestId('acc-delete-confirm'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ localId: editorWe.localId, accomplishments: [] }),
      ]),
    );
    expect(onAccomplishmentsToDeleteChange).toHaveBeenCalledWith([linkedAcc.id]);
  });
});
