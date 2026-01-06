'use client'

import { useToken } from '@/components/auth/auth'
import { useEffect, useState } from 'react'

export function LinkedContacts() {
  const [data, setData] = useState([])
  const { getToken } = useToken()

  useEffect(() => {
    getToken()
      .then((token) =>
        fetch('/api/linked-contacts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      )
      .then((response) => response.json())
      .then(setData)
  }, [getToken])

  if (!data.length) {
    return <div>Loading…</div>
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
