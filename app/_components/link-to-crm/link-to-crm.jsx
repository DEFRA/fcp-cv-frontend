'use client'

import { Button } from '@/components/button/Button'
import { useDataverse } from '@/hooks/data'
import { useEffect, useState } from 'react'

function LinkToCRM({ entityType, identifier, buttonText }) {
  const [shouldExecute, setShouldExecute] = useState(false)

  const { data, isLoading } = useDataverse(
    [entityType, 'crm-url', identifier],
    [shouldExecute]
  )

  // Navigate parent frame to CRM URL when data loads
  useEffect(() => {
    if (data?.url) {
      window.parent.location.href = data.url
    }
  }, [data])

  const handleClick = () => {
    if (data?.url) {
      // Already have URL, navigate parent frame
      window.parent.location.href = data.url
    } else {
      // Don't have URL yet, fetch it
      setShouldExecute(true)
    }
  }

  return (
    <Button onClick={handleClick} loading={isLoading} className="w-46">
      {buttonText}
    </Button>
  )
}

export function LinkToCRMContact({ crn }) {
  return (
    <LinkToCRM
      entityType="contact"
      identifier={crn}
      buttonText="View Contact"
    />
  )
}

export function LinkToCRMAccount({ sbi }) {
  return (
    <LinkToCRM
      entityType="account"
      identifier={sbi}
      buttonText="View Business"
    />
  )
}
