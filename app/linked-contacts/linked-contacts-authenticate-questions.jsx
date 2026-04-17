import {
  KeyValueList,
  KeyValueListContent,
  KeyValueListItem
} from '@/components/key-value-list-v2/key-value-list'
import { useDal } from '@/hooks/data'
import { useSearchParams } from '@/hooks/search-params'
import { ButtonLink } from '@/components/button-link/ButtonLink'
import { Transition } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { notification } from '@/components/notification/Notifications.jsx'

const defaultItems = [
  { dt: 'Date of Birth' },
  { dt: 'Memorable Date' },
  { dt: 'Memorable Location' },
  { dt: 'Memorable Event' },
  { dt: 'Updated At' }
]

export function LinkedContactsAuthenticateQuestions() {
  const { searchParams } = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const crn = searchParams.get('crn')

  const { data, isLoading, error } = useDal(
    ['linked-contacts', 'authenticate-questions', crn],
    [isOpen]
  )

  useEffect(() => {
    if (!isLoading && error && !error.notificationHandled) {
      notification.error(`Contact with CRN ${crn} not found.`)
    }
  }, [data, isLoading, isOpen, crn, error])

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
        <ButtonLink onClick={() => setIsOpen(true)}>
          View Authenticate Questions
        </ButtonLink>
      )}
    </div>
  )
}
