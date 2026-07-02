import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // A page is an admin subpage if it starts with /letsfuck/ but is NOT /letsfuck itself
  const isAdminSubPage = pathname.startsWith("/letsfuck/") && pathname !== "/letsfuck";

  if (isAdminSubPage && !isLoggedIn) {
    // Redirect unauthenticated attempts on admin subpages to the homepage
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  // Run middleware on admin pages only
  matcher: ["/letsfuck/:path*"],
};
