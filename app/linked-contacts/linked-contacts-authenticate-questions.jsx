import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem
} from '@/components/key-value-list-v2/key-value-list'

import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { cn } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import { useState } from 'react'

const defaultItems = [
  { dt: 'Date of Birth' },
  { dt: 'Memorable Date' },
  { dt: 'Memorable Location' },
  { dt: 'Memorable Event' },
  { dt: 'Updated at' }
]

export function LinkedContactsAuthenticateQuestions() {
  const { searchParams } = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useDal(
    ['linked-contacts', 'authenticate-questions', searchParams.get('crn')],
    [isOpen]
  )

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Authenticate Questions</h2>
      <Transition
        show={isOpen}
        enter="transition-all duration-300 ease-out"
        enterFrom="opacity-0 grid-rows-[0fr]"
        enterTo="opacity-100 grid-rows-[1fr]"
        leave="transition-all duration-200 ease-in"
        leaveFrom="opacity-100 grid-rows-[1fr]"
        leaveTo="opacity-0 grid-rows-[0fr]"
      >
        <div className="overflow-hidden grid transition-all duration-300 ease-out">
          <div className="min-h-0">
            <KeyValueList>
              <KeyValueListContent>
                {(data?.items || defaultItems).map((item) => (
                  <KeyValueListItem
                    key={item.dt}
                    loading={isLoading}
                    {...item}
                  />
                ))}
              </KeyValueListContent>
            </KeyValueList>
          </div>
        </div>
      </Transition>
      {!isOpen && (
        <button
          className={cn([
            'text-blue-700 underline underline-offset-2 cursor-pointer',
            'hover:text-blue-900 visited:text-purple-700',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          ])}
          onClick={() => setIsOpen(true)}
        >
          View Authenticate Questions
        </button>
      )}
    </div>
  )
}
