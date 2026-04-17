'use client'

import { useMemo } from 'react'

import { KeyValueList } from '@/components/key-value-list/KeyValueList'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { formatDate } from '@/lib/formatters'

const defaultItems = {
  Date: '',
  Read: '',
  Deleted: ''
}

function computeFromDate(months) {
  if (!months) return ''
  const date = new Date()
  date.setMonth(date.getMonth() - months)
  return date.toISOString().split('T')[0]
}

export function BusinessMessagesDetails() {
  const { searchParams } = useSearchParams()

  const sbi = searchParams.get('sbi')
  const contact = searchParams.get('contact')
  const messageId = searchParams.get('messageId')
  const dateRange = searchParams.get('dateRange') || '24'
  const fromDate = computeFromDate(Number(dateRange))

  const messagesUrlSuffix = fromDate
    ? `${contact}?fromDate=${fromDate}`
    : contact

  const { data: messages = [], isLoading } = useDal(
    ['business-messages', 'messages', sbi, messagesUrlSuffix],
    [contact]
  )

  const message = useMemo(
    () => messages.find((msg) => msg.id === messageId),
    [messages, messageId]
  )

  if (!messageId) {
    return null
  }

  if (!message) {
    return null
  }

  const items = message
    ? {
        Date: formatDate(message.date),
        Read: message.read ? 'Yes' : 'No',
        Deleted: message.deleted ? 'Yes' : 'No'
      }
    : defaultItems

  return (
    <div className="grid gap-6">
      <KeyValueList
        loading={isLoading}
        title={message?.subject}
        items={items}
        contentClassName="w-50"
      />
      <p className="text-gray-500 italic">
        Links in the message below do not work
      </p>
      {message?.body ? (
        <div
          className="whitespace-pre-wrap text-gray-950 border border-black p-2 mr-3"
          dangerouslySetInnerHTML={{ __html: message.body }}
        />
      ) : (
        <div className="text-gray-500 italic">No message content</div>
      )}
    </div>
  )
}
