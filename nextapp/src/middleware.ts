import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminPage && !isLoggedIn) {
    // Redirect to login if trying to access admin dashboard when not logged in
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    // Redirect to admin dashboard if trying to access login page when already logged in
    return Response.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  // Run middleware on admin pages and login page
  matcher: ["/admin/:path*", "/login"],
};
