"use client";

import React, { ReactElement, ReactNode } from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface SessionProviderProps {
  children?: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps): ReactElement {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
