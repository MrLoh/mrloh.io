import { twJoin } from 'tailwind-merge';

export function ContainerOuter({
  children,
  className,
  as,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }) {
  const Component = as || 'div';
  return (
    <Component
      className={twJoin('sm:px-8', 'mx-auto w-full max-w-7xl lg:px-8', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function ContainerInner({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twJoin('relative px-4 sm:px-8 lg:px-12', className)} {...props}>
      <div className="mx-auto max-w-2xl lg:max-w-5xl">{children}</div>
    </div>
  );
}

export function Container({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ContainerOuter className={className} {...props}>
      <ContainerInner>{children}</ContainerInner>
    </ContainerOuter>
  );
}
