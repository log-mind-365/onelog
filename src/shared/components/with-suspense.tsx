import { type ComponentType, Suspense } from "react";
import { Spinner } from "@/shared/components/ui/spinner";

type WithSuspenseOptions = {
  fallback?: React.ReactNode;
};

export const withSuspenseHoc = <P extends object>(
  Component: ComponentType<P>,
  options?: WithSuspenseOptions,
) => {
  const fallback = options?.fallback || <Spinner />;

  const WrappedComponent = (props: P) => {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  };

  WrappedComponent.displayName = `withSuspense(${Component.displayName} Component)`;

  return WrappedComponent;
};
