import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface ActionBarProps {
  resumeId: number;
}

export function ActionBar({ resumeId }: ActionBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link href={`/resumes/${resumeId}/edit`} data-testid="resume-edit-link">
          Edit
        </Link>
      </Button>
      <Button asChild>
        <Link href={`/`} data-testid="resume-close-link">
          Close
        </Link>
      </Button>
    </div>
  );
}
