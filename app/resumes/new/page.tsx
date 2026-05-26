import { CreateResumeForm } from '@/app/_components/create-resume-form';

export default function NewResumePage() {
  return (
    <main className="p-8 h-full">
      <h1 className="text-2xl font-bold mb-6">New Resume</h1>
      <CreateResumeForm />
    </main>
  );
}
