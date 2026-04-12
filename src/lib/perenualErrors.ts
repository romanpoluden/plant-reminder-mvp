import { PerenualApiError, PerenualConfigError } from './perenual'

export function formatPerenualError(e: unknown): string {
  if (e instanceof PerenualConfigError) return e.message
  if (e instanceof PerenualApiError) {
    const hint = e.body?.slice(0, 200)
    return hint ? `${e.message} — ${hint}` : e.message
  }
  if (e instanceof TypeError && e.message === 'Failed to fetch') {
    return 'Could not reach Perenual (network or CORS). If this persists, try a small backend proxy instead of calling the API from the browser.'
  }
  return e instanceof Error ? e.message : 'Something went wrong.'
}
