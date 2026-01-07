'use client'

import { Skeleton } from '@/components/ui/skeleton.jsx'
import { useMsal } from '@azure/msal-react'

export function Profile() {
  const { instance, accounts, inProgress } = useMsal()

  return (
    <div className="flex gap-1 text-xs items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          clipRule="evenodd"
        />
      </svg>

      {inProgress === 'startup' ? (
        <Skeleton className="h-3 w-50" />
      ) : (
        <>
          {accounts.length > 0 ? (
            <>
              {accounts[0].username.toLowerCase()}
              <button
                className="bg-red-500 p-1 rounded-sm text-white"
                onClick={() => instance.logoutPopup()}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="bg-green-500 p-1 rounded-sm text-white"
              onClick={() => instance.loginPopup()}
            >
              Login
            </button>
          )}
        </>
      )}
    </div>
  )

  // if (inProgress === 'startup') {
  //   return null
  // }

  // if (accounts.length > 0) {
  //   return (
  //     <>
  //       <span>There are currently {accounts.length} users signed in!</span>
  //       <button onClick={() => instance.logoutPopup()}>Logout</button>
  //     </>
  //   )
  // } else if (inProgress === 'login') {
  //   return <span>Login is currently in progress!</span>
  // } else {
  //   return (
  //     <>
  //       <span>There are currently no users signed in!</span>
  //       <button onClick={() => instance.loginPopup()}>Login</button>
  //     </>
  //   )
  // }
}
