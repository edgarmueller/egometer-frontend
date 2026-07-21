import { Angry, Frown, Laugh, Meh, Smile } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { cn } from '@/lib/utils'
import { MOOD_LABELS, MOOD_VALUES, type MoodValue } from '@/features/meters/meter-types'
import type { ChartProps, CellProps, DayInputProps, Widget } from './types'

const MOOD_ICONS: Record<MoodValue, typeof Smile> = {
  bad: Angry,
  down: Frown,
  okayish: Meh,
  good: Smile,
  dabomb: Laugh,
}

const MOOD_SCORE: Record<MoodValue, number> = {
  bad: 1,
  down: 2,
  okayish: 3,
  good: 4,
  dabomb: 5,
}

function DayInput({ meter, value, onChange, disabled }: DayInputProps<MoodValue>) {
  return (
    <div className="flex items-center justify-between gap-1">
      {MOOD_VALUES.map((mood) => {
        const Icon = MOOD_ICONS[mood]
        const isSelected = value === mood
        return (
          <button
            key={mood}
            type="button"
            disabled={disabled}
            aria-label={MOOD_LABELS[mood]}
            title={MOOD_LABELS[mood]}
            onClick={() => onChange(mood)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs transition-colors disabled:opacity-50',
              isSelected
                ? 'border-transparent text-white'
                : 'border-input text-muted-foreground hover:bg-accent',
            )}
            style={isSelected ? { backgroundColor: meter.color } : undefined}
          >
            <Icon className="h-5 w-5" />
            <span className="hidden sm:inline">{MOOD_LABELS[mood]}</span>
          </button>
        )
      })}
    </div>
  )
}

function Cell({ meter, value }: CellProps<MoodValue>) {
  if (!value) return <div className="h-full w-full rounded" />
  const Icon = MOOD_ICONS[value]
  return (
    <div className="flex h-full w-full items-center justify-center rounded" title={MOOD_LABELS[value]}>
      <Icon className="h-3.5 w-3.5" style={{ color: meter.color }} />
    </div>
  )
}

function Chart({ meter, data }: ChartProps<MoodValue>) {
  const chartData = data.map((d) => ({
    date: d.date,
    value: d.value ? MOOD_SCORE[d.value] : null,
    label: d.value ? MOOD_LABELS[d.value] : '—',
  }))
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
        <YAxis
          domain={[1, 5]}
          ticks={[1, 2, 3, 4, 5]}
          tickFormatter={(v) => MOOD_LABELS[MOOD_VALUES[v - 1]]}
          tick={{ fontSize: 10 }}
          width={70}
        />
        <Tooltip formatter={(_v, _n, item) => item.payload.label} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={meter.color}
          strokeWidth={2}
          connectNulls
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const MoodWidget: Widget<MoodValue> = { DayInput, Cell, Chart }
