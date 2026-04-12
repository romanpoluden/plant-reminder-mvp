/** Perenual Plant Data API v2 — browser calls with `VITE_PERENUAL_API_KEY` (client-visible). */
const API_BASE = 'https://perenual.com/api/v2'

export class PerenualConfigError extends Error {
  override readonly name = 'PerenualConfigError'
}

export class PerenualApiError extends Error {
  override readonly name = 'PerenualApiError'
  readonly status: number
  readonly body: string | undefined

  constructor(message: string, status: number, body?: string) {
    super(message)
    this.status = status
    this.body = body
  }
}

export type PerenualImage = {
  thumbnail?: string | null
  small_url?: string | null
  medium_url?: string | null
  regular_url?: string | null
}

/** Row from `species-list` (fields we use; API may add more). */
export type PerenualSpeciesSummary = {
  id: number
  common_name: string | null
  scientific_name: string[] | null
  other_name: string[] | null
  default_image: PerenualImage | null
}

export function speciesDisplayName(s: PerenualSpeciesSummary): string {
  const common = s.common_name?.trim()
  if (common) return common.slice(0, 200)
  const sci = s.scientific_name?.[0]?.trim()
  if (sci) return sci.slice(0, 200)
  return 'Unknown plant'
}

export type SpeciesListResponse = {
  data: PerenualSpeciesSummary[]
  to: number
  per_page: number
  current_page: number
  from: number
  last_page: number
  total: number
}

export type SpeciesListParams = {
  page?: number
  /** Search keywords (common / scientific names). */
  q?: string
  order?: 'asc' | 'desc'
}

export function isPerenualConfigured(): boolean {
  const key = import.meta.env.VITE_PERENUAL_API_KEY
  return typeof key === 'string' && key.trim() !== ''
}

function getApiKey(): string {
  const key = import.meta.env.VITE_PERENUAL_API_KEY
  if (typeof key !== 'string' || key.trim() === '') {
    throw new PerenualConfigError(
      'VITE_PERENUAL_API_KEY is missing. Add it to .env.local and restart the dev server.',
    )
  }
  return key.trim()
}

export type FetchSpeciesListOptions = {
  signal?: AbortSignal
}

/**
 * Paginated species search / browse.
 * @see https://perenual.com/docs/api
 */
export async function fetchSpeciesList(
  params: SpeciesListParams = {},
  options: FetchSpeciesListOptions = {},
): Promise<SpeciesListResponse> {
  const key = getApiKey()
  const url = new URL(`${API_BASE}/species-list`)
  url.searchParams.set('key', key)
  if (params.page != null && params.page > 0) {
    url.searchParams.set('page', String(params.page))
  }
  if (params.q != null && params.q.trim() !== '') {
    url.searchParams.set('q', params.q.trim())
  }
  if (params.order) {
    url.searchParams.set('order', params.order)
  }

  const res = await fetch(url.toString(), { signal: options.signal })
  const text = await res.text()

  if (!res.ok) {
    throw new PerenualApiError(
      `Perenual species-list failed (${res.status})`,
      res.status,
      text,
    )
  }

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new PerenualApiError(
      'Perenual returned invalid JSON',
      res.status,
      text,
    )
  }

  return json as SpeciesListResponse
}
