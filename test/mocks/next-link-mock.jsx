import React from 'react'

export default function NextLinkMock({ children, href, ...props }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
