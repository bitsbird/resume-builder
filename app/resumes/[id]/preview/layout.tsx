// TODO: persist selected templateId to the DB (Resume.templateId field) when the user previews,
// so the last-used template is remembered across sessions.

interface PreviewLayoutProps {
  children: React.ReactNode;
}

export default function PreviewLayout({ children }: PreviewLayoutProps) {
  return <div>{children}</div>;
}
