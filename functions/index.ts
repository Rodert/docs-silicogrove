interface PagesContext {
  request: Request
  next: () => Promise<Response>
}

function readCookie(request: Request, name: string) {
  const value = request.headers.get('cookie') ?? ''
  return value.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1)
}

function preferredLocale(request: Request) {
  const selected = readCookie(request, 'docs_locale')
  if (selected === 'zh-cn') return '/zh-cn/'
  if (selected === 'en') return '/'

  const languages = request.headers.get('accept-language')?.toLowerCase() ?? ''
  if (/(^|,)\s*zh(?:-cn|-sg)?(?:;|,|$)/.test(languages)) return '/zh-cn/'
  return '/'
}

export const onRequest: PagesFunction = async (context: PagesContext) => {
  const url = new URL(context.request.url)
  if (url.pathname !== '/') return context.next()

  const destination = preferredLocale(context.request)
  if (destination === '/') return context.next()

  url.pathname = destination
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      'Cache-Control': 'private, no-store',
      Vary: 'Accept-Language, Cookie'
    }
  })
}
