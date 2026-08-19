import { useEffect, useCallback, useState } from 'react'

// Generic hook to manage resource states: loading, success, empty, error
export default function useResource({
  documentId,
  fetchFn,
  generateFn,
  regenerateFn,
  deleteFn,
  enabled = true,
}) {
  const [status, setStatus] = useState('idle') // 'idle'|'loading'|'success'|'empty'|'error'
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!documentId || !enabled) {
      setStatus('idle')
      setData(null)
      return
    }
    setStatus('loading')
    setError(null)
    try {
      const result = await fetchFn(documentId)
      if (!result) {
        setStatus('empty')
        setData(null)
      } else {
        setStatus('success')
        setData(result)
      }
    } catch (err) {
      // Treat 404 as empty rather than error when backend signals not found
      if (err && err.response && err.response.status === 404) {
        setStatus('empty')
        setData(null)
      } else {
        setStatus('error')
        setError(err)
        setData(null)
      }
    }
  }, [documentId, fetchFn, enabled])

  useEffect(() => {
    load()
  }, [load])

  const generate = useCallback(async () => {
    if (!documentId || !generateFn) return null
    setStatus('loading')
    try {
      const res = await generateFn(documentId)
      setData(res)
      setStatus('success')
      return res
    } catch (err) {
      setStatus('error')
      setError(err)
      throw err
    }
  }, [documentId, generateFn])

  const regenerate = useCallback(async () => {
    if (!documentId || !regenerateFn) return null
    setStatus('loading')
    try {
      const res = await regenerateFn(documentId)
      setData(res)
      setStatus('success')
      return res
    } catch (err) {
      setStatus('error')
      setError(err)
      throw err
    }
  }, [documentId, regenerateFn])

  const remove = useCallback(async () => {
    if (!deleteFn || !data) return
    try {
      await deleteFn(data.id || data.idSummary || data.idQuiz || data.idFlashcard)
      setData(null)
      setStatus('empty')
    } catch (err) {
      setStatus('error')
      setError(err)
      throw err
    }
  }, [deleteFn, data])

  const reload = useCallback(() => load(), [load])

  return {
    status,
    data,
    error,
    generate,
    regenerate,
    remove,
    reload,
  }
}
