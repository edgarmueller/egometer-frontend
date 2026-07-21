import type { ComponentType } from 'react'

import type { Meter } from '@/features/meters/meter-types'

export interface DayInputProps<V> {
  meter: Meter
  value: V | undefined
  onChange: (value: V) => void
  disabled?: boolean
}

export interface CellProps<V> {
  meter: Meter
  value: V | undefined
}

export interface ChartDatum<V> {
  /** YYYY-MM-DD */
  date: string
  value: V | undefined
}

export interface ChartProps<V> {
  meter: Meter
  data: ChartDatum<V>[]
}

export interface Widget<V = unknown> {
  DayInput: ComponentType<DayInputProps<V>>
  Cell: ComponentType<CellProps<V>>
  Chart: ComponentType<ChartProps<V>>
}
