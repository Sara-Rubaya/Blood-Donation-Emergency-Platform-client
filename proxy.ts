import { NextRequest, NextResponse } from "next/server";

const ROLE_PREFIX: Record<string, string> = {
  "/admin": "ADMIN",
  "/dashboard": "REQUESTER",
  "/provider": "DONOR",
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const matchedPrefix = Object.keys(ROLE_PREFIX).find((p) =>
    pathname.startsWith(p)
  );

  if (!matchedPrefix) return NextResponse.next();

  const token = req.cookies.get("bd_token")?.value;
  const role = req.cookies.get("bd_role")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (role !== ROLE_PREFIX[matchedPrefix]) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/provider/:path*"],
};
