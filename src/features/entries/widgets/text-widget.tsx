import { useEffect, useState } from 'react'
import { NotebookText } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ChartProps, CellProps, DayInputProps, Widget } from './types'

function DayInput({ value, onChange, disabled }: DayInputProps<string>) {
  const [text, setText] = useState(value ?? '')

  useEffect(() => {
    setText(value ?? '')
  }, [value])

  return (
    <textarea
      className={cn(
        'flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      )}
      disabled={disabled}
      value={text}
      placeholder="Write a few notes about your day…"
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        if (text !== (value ?? '')) onChange(text)
      }}
    />
  )
}

function Cell({ meter, value }: CellProps<string>) {
  const hasEntry = Boolean(value && value.trim().length > 0)
  return (
    <div className="flex h-full w-full items-center justify-center rounded" title={value || undefined}>
      {hasEntry ? (
        <NotebookText className="h-3.5 w-3.5" style={{ color: meter.color }} />
      ) : null}
    </div>
  )
}

function Chart({ data }: ChartProps<string>) {
  const entries = data.filter((d) => d.value && d.value.trim().length > 0)
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No journal entries in this period.</p>
  }
  return (
    <ul className="flex max-h-56 flex-col gap-2 overflow-y-auto text-sm">
      {entries
        .slice()
        .reverse()
        .map((entry) => (
          <li key={entry.date} className="border-b border-border pb-2 last:border-0">
            <span className="mr-2 font-medium text-muted-foreground">{entry.date}</span>
            <span className="text-foreground">{entry.value}</span>
          </li>
        ))}
    </ul>
  )
}

export const TextWidget: Widget<string> = { DayInput, Cell, Chart }
