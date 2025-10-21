import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, vi } from 'vitest'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '../dialog'
import { ToastProvider, useToast } from '../Toast'

function DialogTestHarness() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>Open Dialog</button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Test Dialog</DialogTitle>
        <div>Dialog body</div>
      </DialogContent>
    </Dialog>
  )
}

function ToastTestHarness() {
  const { show, Toast } = useToast()
  return (
    <div>
      <button onClick={() => show('It worked', 'success', 500)}>Show</button>
      {Toast}
    </div>
  )
}

describe('Dialog and Toast UI', () => {
  test('opens and renders dialog content', async () => {
    render(<DialogTestHarness />)
    const btn = screen.getByText('Open Dialog')
    fireEvent.click(btn)
    expect(await screen.findByText('Test Dialog')).toBeInTheDocument()
    expect(screen.getByText('Dialog body')).toBeInTheDocument()
  })

  test('shows toast and auto-dismisses', async () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <ToastTestHarness />
      </ToastProvider>
    )
    const btn = screen.getByText('Show')
    fireEvent.click(btn)
    expect(await screen.findByText('It worked')).toBeInTheDocument()
    // advance timers to allow auto-dismiss
    vi.advanceTimersByTime(700)
    await waitFor(() => expect(screen.queryByText('It worked')).not.toBeInTheDocument())
    vi.useRealTimers()
  })
})
