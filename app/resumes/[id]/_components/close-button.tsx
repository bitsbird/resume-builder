'use client';

import { useRouter } from 'next/navigation';

import { IconX } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';

export function CloseButton() {
  const router = useRouter();

  return (
    <Button variant="ghost" size="icon" onClick={() => router.back()}>
      <IconX />
    </Button>
  );
}
