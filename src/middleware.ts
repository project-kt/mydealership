import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

export default async function middleware(req: NextRequest) {
  const handleI18nRouting = createIntlMiddleware({
    locales: ["en", "it"],
    localePrefix: "never",
    defaultLocale: "en",
  });
  const res = handleI18nRouting(req);

  // Authentication removed - implement your own auth solution here if needed

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
