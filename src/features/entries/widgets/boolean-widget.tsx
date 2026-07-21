import { Check, X } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { cn } from '@/lib/utils'
import type { ChartProps, CellProps, DayInputProps, Widget } from './types'

function DayInput({ meter, value, onChange, disabled }: DayInputProps<boolean>) {
  const checked = value === true
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex h-10 w-full items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors disabled:opacity-50',
        checked ? 'border-transparent text-white' : 'border-input text-muted-foreground hover:bg-accent',
      )}
      style={checked ? { backgroundColor: meter.color } : undefined}
    >
      {checked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      {checked ? 'Done' : 'Not done'}
    </button>
  )
}

function Cell({ meter, value }: CellProps<boolean>) {
  const checked = value === true
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded"
      title={checked ? 'Done' : value === false ? 'Not done' : 'No entry'}
    >
      <div
        className={cn('h-3 w-3 rounded-full border', !checked && 'border-muted-foreground/30')}
        style={checked ? { backgroundColor: meter.color } : undefined}
      />
    </div>
  )
}

function Chart({ meter, data }: ChartProps<boolean>) {
  const chartData = data.map((d) => ({
    date: d.date,
    value: d.value === true ? 1 : 0,
  }))
  const doneCount = chartData.filter((d) => d.value === 1).length

  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">
        {doneCount} / {chartData.length} days
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
          <YAxis allowDecimals={false} domain={[0, 1]} tick={{ fontSize: 10 }} width={20} />
          <Tooltip />
          <Bar dataKey="value" fill={meter.color} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const BooleanWidget: Widget<boolean> = { DayInput, Cell, Chart }
