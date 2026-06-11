import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export function H1({ children, className, testId }: TypographyProps) {
  return (
    <h1
      className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className)}
      data-testid={testId}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className, testId }: TypographyProps) {
  return (
    <h2
      className={cn('scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0', className)}
      data-testid={testId}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className, testId }: TypographyProps) {
  return (
    <h3
      className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}
      data-testid={testId}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className, testId }: TypographyProps) {
  return (
    <h4
      className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}
      data-testid={testId}
    >
      {children}
    </h4>
  );
}

export function H5({ children, className, testId }: TypographyProps) {
  return (
    <h4
      className={cn('text scroll-m-20 font-semibold tracking-tight', className)}
      data-testid={testId}
    >
      {children}
    </h4>
  );
}

export function BaseText({ children, className, testId }: TypographyProps) {
  return (
    <span
      className={cn('text scroll-m-20 text-base text-gray-200', className)}
      data-testid={testId}
    >
      {children}
    </span>
  );
}

export function P({ children, className, testId }: TypographyProps) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} data-testid={testId}>
      {children}
    </p>
  );
}

export function Blockquote({ children, className, testId }: TypographyProps) {
  return (
    <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)} data-testid={testId}>
      {children}
    </blockquote>
  );
}

export function InlineCode({ children, className, testId }: TypographyProps) {
  return (
    <code
      className={cn(
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className,
      )}
      data-testid={testId}
    >
      {children}
    </code>
  );
}

export function Lead({ children, className, testId }: TypographyProps) {
  return (
    <p className={cn('text-muted-foreground text-xl', className)} data-testid={testId}>
      {children}
    </p>
  );
}

export function Small({ children, className, testId }: TypographyProps) {
  return (
    <small className={cn('text-sm leading-none font-medium', className)} data-testid={testId}>
      {children}
    </small>
  );
}

export function Muted({ children, className, testId }: TypographyProps) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} data-testid={testId}>
      {children}
    </p>
  );
}
