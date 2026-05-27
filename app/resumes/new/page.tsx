import { CreateResumeForm } from '@/app/_components/create-resume-form';

export default function NewResumePage() {
  return (
    <main className="h-full p-8">
      <h1 className="mb-6 text-2xl font-bold">New Resume</h1>
      <CreateResumeForm />
    </main>
  );
}
