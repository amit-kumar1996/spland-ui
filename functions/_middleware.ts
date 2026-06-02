export async function onRequest(context: any) {
  const host = context.request.headers.get("host");

  if (host?.endsWith(".pages.dev")) {
    const url = new URL(context.request.url);

    return Response.redirect(
      `https://spland.in${url.pathname}${url.search}`,
      301
    );
  }

  return context.next();
}