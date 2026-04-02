'use client'

import { useEffect, useId, useState } from 'react'

const MIN_DATE = '2015-01-01'

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function DatePicker({
  value = '',
  onChange,
  onInvalidDate,
  label = 'Date',
  min = MIN_DATE
}) {
  const inputId = useId()
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const max = todayISO()

  const isValid = (dateStr) => {
    if (!dateStr) return false
    return dateStr >= min && dateStr <= max
  }

  const commit = (dateStr) => {
    if (isValid(dateStr)) {
      onChange(dateStr)
    } else {
      setInputValue(value)
      if (dateStr && onInvalidDate) {
        if (dateStr < min) {
          onInvalidDate('below', min)
        } else if (dateStr > max) {
          onInvalidDate('above', max)
        }
      }
    }
  }

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 w-fit">
      <label className="font-bold" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="date"
        className="border-2 border-green-700 p-2 focus:outline-none focus:ring-green-700"
        value={inputValue}
        min={min}
        max={max}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit(e.target.value)
        }}
      />
    </div>
  )
}
