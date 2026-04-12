import { type FormEvent, useEffect, useId, useState } from 'react'
import {
  fetchSpeciesList,
  isPerenualConfigured,
  speciesDisplayName,
  type PerenualSpeciesSummary,
} from '../lib/perenual'
import { formatPerenualError } from '../lib/perenualErrors'

type Props = {
  onAdd: (species: PerenualSpeciesSummary) => void
}

export function PerenualCatalog({ onAdd }: Props) {
  const searchId = useId()
  const [inputQuery, setInputQuery] = useState('')
  const [committedQuery, setCommittedQuery] = useState('')
  const [items, setItems] = useState<PerenualSpeciesSummary[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(() => isPerenualConfigured())
  const [error, setError] = useState<string | null>(null)

  const configured = isPerenualConfigured()

  useEffect(() => {
    if (!configured) return
    const ac = new AbortController()
    let ignore = false

    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchSpeciesList(
          { page: 1, q: committedQuery || undefined },
          { signal: ac.signal },
        )
        if (ignore) return
        setItems(res.data)
        setCurrentPage(res.current_page)
        setLastPage(res.last_page)
        setTotal(res.total)
      } catch (e) {
        if (ac.signal.aborted) return
        if (ignore) return
        setError(formatPerenualError(e))
        setItems([])
      } finally {
        if (!ignore) setLoading(false)
      }
    })()

    return () => {
      ignore = true
      ac.abort()
    }
  }, [committedQuery, configured])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    setCommittedQuery(inputQuery.trim())
  }

  async function loadMore() {
    if (!configured || loading || currentPage >= lastPage) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetchSpeciesList({
        page: currentPage + 1,
        q: committedQuery || undefined,
      })
      setItems((prev) => [...prev, ...res.data])
      setCurrentPage(res.current_page)
      setLastPage(res.last_page)
      setTotal(res.total)
    } catch (e) {
      setError(formatPerenualError(e))
    } finally {
      setLoading(false)
    }
  }

  if (!configured) {
    return (
      <div className="catalog catalog-unconfigured">
        <p className="region-placeholder">
          To search the plant catalog, add{' '}
          <code className="catalog-code">VITE_PERENUAL_API_KEY</code> to{' '}
          <code className="catalog-code">.env.local</code>, then restart{' '}
          <code className="catalog-code">npm run dev</code>. See{' '}
          <code className="catalog-code">.env.example</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="catalog">
      <form className="catalog-search" onSubmit={handleSearch}>
        <label className="catalog-search-label" htmlFor={searchId}>
          Search catalog
        </label>
        <div className="catalog-search-row">
          <input
            id={searchId}
            className="field-input catalog-search-input"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="e.g. monstera, snake plant"
            autoComplete="off"
          />
          <button type="submit" className="btn primary" disabled={loading}>
            Search
          </button>
        </div>
        <p className="catalog-hint">
          Results come from Perenual. Leave the box empty and press Search to browse
          from the start.
        </p>
      </form>

      {error ? <p className="catalog-error">{error}</p> : null}

      {loading && items.length === 0 ? (
        <p className="region-placeholder">Loading…</p>
      ) : null}

      {items.length > 0 ? (
        <>
          <p className="catalog-meta">
            Showing {items.length} of {total} species
            {committedQuery ? ` for “${committedQuery}”` : ''}.
          </p>
          <ul className="catalog-list">
            {items.map((s) => {
              const name = speciesDisplayName(s)
              const thumb =
                s.default_image?.thumbnail ||
                s.default_image?.small_url ||
                s.default_image?.medium_url ||
                null
              const sci = s.scientific_name?.[0]
              return (
                <li key={s.id} className="catalog-row">
                  {thumb ? (
                    <img
                      className="catalog-thumb"
                      src={thumb}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                    />
                  ) : (
                    <div className="catalog-thumb catalog-thumb-placeholder" aria-hidden />
                  )}
                  <div className="catalog-row-text">
                    <span className="catalog-name">{name}</span>
                    {sci && sci !== name ? (
                      <span className="catalog-sci">{sci}</span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="btn small"
                    aria-label={`Add ${name} to my plants`}
                    onClick={() => onAdd(s)}
                  >
                    Add
                  </button>
                </li>
              )
            })}
          </ul>
          {currentPage < lastPage ? (
            <button
              type="button"
              className="btn catalog-more"
              disabled={loading}
              onClick={() => void loadMore()}
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          ) : null}
        </>
      ) : null}

      {!loading && items.length === 0 && !error ? (
        <p className="region-placeholder">No results. Try another search.</p>
      ) : null}
    </div>
  )
}
