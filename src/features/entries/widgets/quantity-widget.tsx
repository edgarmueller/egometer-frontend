import { Circle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { cn } from '@/lib/utils'
import {
  QUANTITY_LABELS,
  QUANTITY_VALUES,
  type QuantityValue,
} from '@/features/meters/meter-types'
import type { ChartProps, CellProps, DayInputProps, Widget } from './types'

const QUANTITY_SCORE: Record<QuantityValue, number> = {
  none: 0,
  a_bit: 1,
  a_lot: 2,
}

const QUANTITY_SIZE: Record<QuantityValue, number> = {
  none: 10,
  a_bit: 15,
  a_lot: 20,
}

function QuantityIcon({ level, color, selected }: { level: QuantityValue; color: string; selected: boolean }) {
  return (
    <Circle
      className="shrink-0"
      size={QUANTITY_SIZE[level]}
      color={selected ? color : 'currentColor'}
      fill={selected ? color : 'none'}
    />
  )
}

function DayInput({ meter, value, onChange, disabled }: DayInputProps<QuantityValue>) {
  return (
    <div className="flex items-center gap-2">
      {QUANTITY_VALUES.map((level) => {
        const isSelected = value === level
        return (
          <button
            key={level}
            type="button"
            disabled={disabled}
            title={QUANTITY_LABELS[level]}
            onClick={() => onChange(level)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs transition-colors disabled:opacity-50',
              isSelected
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-input text-muted-foreground hover:bg-accent',
            )}
          >
            <QuantityIcon level={level} color={meter.color} selected={isSelected} />
            <span>{QUANTITY_LABELS[level]}</span>
          </button>
        )
      })}
    </div>
  )
}

function Cell({ meter, value }: CellProps<QuantityValue>) {
  if (!value) return <div className="h-full w-full rounded" />
  return (
    <div className="flex h-full w-full items-center justify-center rounded" title={QUANTITY_LABELS[value]}>
      <QuantityIcon level={value} color={meter.color} selected />
    </div>
  )
}

function Chart({ meter, data }: ChartProps<QuantityValue>) {
  const chartData = data.map((d) => ({
    date: d.date,
    value: d.value ? QUANTITY_SCORE[d.value] : 0,
    label: d.value ? QUANTITY_LABELS[d.value] : '—',
  }))
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
        <YAxis
          domain={[0, 2]}
          ticks={[0, 1, 2]}
          tickFormatter={(v) => QUANTITY_LABELS[QUANTITY_VALUES[v]]}
          tick={{ fontSize: 10 }}
          width={50}
        />
        <Tooltip formatter={(_v, _n, item) => item.payload.label} />
        <Bar dataKey="value" fill={meter.color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export const QuantityWidget: Widget<QuantityValue> = { DayInput, Cell, Chart }
