import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Input } from '@/components/ui/input'
import type { ChartProps, CellProps, DayInputProps, Widget } from './types'

function DayInput({ meter, value, onChange, disabled }: DayInputProps<number>) {
  const [text, setText] = useState(value === undefined ? '' : String(value))

  useEffect(() => {
    setText(value === undefined ? '' : String(value))
  }, [value])

  const commit = () => {
    const parsed = Number(text)
    if (text.trim() !== '' && Number.isFinite(parsed)) {
      onChange(parsed)
    } else if (text.trim() === '' && value !== undefined) {
      // leave as-is; clearing to "no entry" isn't supported by PUT upsert semantics
      setText(String(value))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        step="any"
        inputMode="decimal"
        disabled={disabled}
        value={text}
        placeholder={meter.dailyGoal ? `Goal: ${meter.dailyGoal}` : '0'}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
          }
        }}
      />
    </div>
  )
}

function Cell({ meter, value }: CellProps<number>) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded text-xs font-medium">
      {value !== undefined ? <span style={{ color: meter.color }}>{value}</span> : null}
    </div>
  )
}

function Chart({ meter, data }: ChartProps<number>) {
  const chartData = data.map((d) => ({ date: d.date, value: d.value ?? 0 }))
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
        <YAxis tick={{ fontSize: 10 }} width={28} />
        <Tooltip />
        <Bar dataKey="value" fill={meter.color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export const NumberWidget: Widget<number> = { DayInput, Cell, Chart }
