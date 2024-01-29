import createMiddleware from "next-intl/middleware";

const locales = ["en", "it"];

export default createMiddleware({
  locales,
  localePrefix: "never",
  defaultLocale: "en",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(it|en)/:path*"],
};