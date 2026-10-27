import { NextResponse, type NextRequest } from "next/server";
import { ES_NAME } from "@/lib/i18n/routes";

/*
 * Language routing. The folders are app/[lang]/...; the addresses of the browser are:
 *   Spanish (the first language, no prefix): /work       → app/es/work
 *   English:                                 /en/work    → app/en/work, /en/contact → app/en/contacto
 * "/es/..." is not a public address (the Spanish one has no prefix): it redirects.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "es") {
    const url = request.nextUrl.clone();
    url.pathname = `/${segments.slice(1).join("/")}`;
    return NextResponse.redirect(url, 308);
  }

  if (segments[0] === "en") {
    // /en/contacto is the folder name, not the address: the address is /en/contact.
    if (segments[1] === "contacto") {
      const url = request.nextUrl.clone();
      url.pathname = `/en/contact${segments.length > 2 ? `/${segments.slice(2).join("/")}` : ""}`;
      return NextResponse.redirect(url, 308);
    }
    if (segments[1] && ES_NAME[segments[1]]) {
      const rewritten = [...segments];
      rewritten[1] = ES_NAME[segments[1]];
      return NextResponse.rewrite(new URL(`/${rewritten.join("/")}${search}`, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.rewrite(new URL(`/es${pathname === "/" ? "" : pathname}${search}`, request.url));
}

export const config = {
  // Every page address; not the assets of Next (_next), nor any file with an extension (images, icons, robots.txt…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
