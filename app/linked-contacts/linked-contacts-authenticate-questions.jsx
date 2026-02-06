'use client'

import { KeyValueList } from '@/components/key-value-list/KeyValueList'
import { useSearchParams } from '@/hooks/search-params'
import { useDal } from '@/hooks/use-dal'
import { useState } from 'react'

export function LinkedContactsAuthenticateQuestions() {
  const { searchParams } = useSearchParams()
  const [visible, setVisible] = useState(false)

  const { data } = useDal(
    ['linked-contacts', 'authenticate-questions', searchParams.get('crn')],
    [visible]
  )

  if (!visible) {
    return (
      <button onClick={() => setVisible(true)}>
        View Authenticate Questions
      </button>
    )
  }

  return (
    <div className="w-3/4">
      <KeyValueList
        title={'Authenticate questions'}
        items={data?.items || {}}
      />
    </div>
  )
}
