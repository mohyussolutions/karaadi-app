export function getActiveTab(pathname: string): string {
  if (pathname.startsWith("/profile/chat") || pathname.startsWith("/messages"))
    return "messages";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/new-ad")) return "new-ad";
  if (pathname.startsWith("/businesses") || pathname.startsWith("/business/"))
    return "businesses";
  return "home";
}
