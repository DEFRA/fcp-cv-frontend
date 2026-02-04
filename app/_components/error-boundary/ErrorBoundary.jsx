'use client'

import React from 'react'
import { Button } from '../button/Button'
import { FullWidthSection, Sections } from '../sections/sections'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleRefresh = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <Sections srTitle="Something went wrong">
        <FullWidthSection>
          <h2>Something went wrong</h2>
          <div className="mt-2 text-sm text-slate-700">
            The page hit an unexpected error. You can try refreshing to recover
            from this error.
            {this.state.error && (
              <details className="mt-2 text-sm text-slate-700">
                <summary className="cursor-pointer font-medium">
                  Error details
                </summary>
                <blockquote className="mt-1 border-l-4 border-slate-300 bg-slate-50 px-4 py-2">
                  <pre className="whitespace-pre-wrap m-0 text-xs">
                    {JSON.stringify(
                      {
                        error: this.state.error,
                        url:
                          typeof window !== 'undefined'
                            ? window.location.href
                            : undefined,
                        userAgent:
                          typeof navigator !== 'undefined'
                            ? navigator.userAgent
                            : undefined,
                        platform:
                          typeof navigator !== 'undefined'
                            ? navigator.platform
                            : undefined,
                        language:
                          typeof navigator !== 'undefined'
                            ? navigator.language
                            : undefined,
                        timestamp: new Date().toISOString()
                      },
                      null,
                      2
                    )}
                  </pre>
                </blockquote>
              </details>
            )}
          </div>
          <div className="mt-4">
            <Button onClick={this.handleRefresh}>Refresh</Button>
          </div>
        </FullWidthSection>
      </Sections>
    )
  }
}
