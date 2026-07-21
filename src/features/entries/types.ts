export interface Entry<V = unknown> {
  id: string
  /** YYYY-MM-DD */
  date: string
  meterId: string
  value: V
}

export interface DateRange {
  /** YYYY-MM-DD, inclusive */
  from: string
  /** YYYY-MM-DD, inclusive */
  to: string
}
