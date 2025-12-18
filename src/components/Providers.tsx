"use client";

import { ReactNode } from "react";
import { PageErrorBoundary } from "./ErrorBoundary";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <PageErrorBoundary>{children}</PageErrorBoundary>;
}
