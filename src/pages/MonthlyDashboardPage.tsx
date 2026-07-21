import { useNavigate, useParams } from 'react-router-dom'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isValid,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { entryKey, indexEntriesByMeterAndDate } from '@/features/entries/entry-utils'
import { useEntries } from '@/features/entries/hooks'
import { widgetRegistry } from '@/features/entries/widget-registry'
import { useMeters } from '@/features/meters/hooks'
import { getMeterIcon } from '@/features/meters/meter-icons'
import { cn } from '@/lib/utils'

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function resolveMonth(year: string | undefined, month: string | undefined): Date {
  const y = Number(year)
  const m = Number(month)
  if (Number.isInteger(y) && Number.isInteger(m) && m >= 1 && m <= 12) {
    const candidate = new Date(y, m - 1, 1)
    if (isValid(candidate)) return candidate
  }
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export default function MonthlyDashboardPage() {
  const { year, month } = useParams<{ year: string; month: string }>()
  const navigate = useNavigate()

  const monthDate = resolveMonth(year, month)
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd })
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const from = format(monthStart, 'yyyy-MM-dd')
  const to = format(monthEnd, 'yyyy-MM-dd')

  const { data: meters, isLoading: metersLoading } = useMeters()
  const { data: entries, isLoading: entriesLoading } = useEntries({ from, to })
  const entriesMap = indexEntriesByMeterAndDate(entries)

  const goTo = (d: Date) => navigate(`/monthly/${d.getFullYear()}/${d.getMonth() + 1}`)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous month"
          onClick={() => goTo(subMonths(monthDate, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">{format(monthDate, 'MMMM yyyy')}</h1>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next month"
          onClick={() => goTo(addMonths(monthDate, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {(metersLoading || entriesLoading) && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}
      {!metersLoading && meters?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You don&apos;t have any meters yet. Head to Meters to create one.
        </p>
      )}

      <div className="flex flex-col gap-10">
        {meters?.map((meter) => {
          const widget = widgetRegistry[meter.type]
          const Icon = getMeterIcon(meter.icon)
          const chartData = monthDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            return { date: dateStr, value: entriesMap.get(entryKey(meter.id, dateStr))?.value }
          })

          return (
            <section key={meter.id}>
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${meter.color}26`, color: meter.color }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <h2 className="font-medium">{meter.name}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-[auto,1fr]">
                <div>
                  <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
                    {WEEKDAY_LABELS.map((label) => (
                      <div key={label}>{label}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {gridDays.map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd')
                      const inMonth = isSameMonth(day, monthDate)
                      const entry = entriesMap.get(entryKey(meter.id, dateStr))
                      return (
                        <button
                          key={dateStr}
                          type="button"
                          title={dateStr}
                          onClick={() => navigate(`/daily/${dateStr}`)}
                          className={cn(
                            'flex h-10 w-10 flex-col items-center justify-center gap-0.5 rounded border text-[9px] transition-colors hover:bg-accent',
                            inMonth ? 'border-border' : 'border-transparent opacity-30',
                          )}
                        >
                          <span className="leading-none text-muted-foreground">
                            {format(day, 'd')}
                          </span>
                          <span className="flex h-3.5 w-3.5 items-center justify-center">
                            <widget.Cell meter={meter} value={entry?.value} />
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <Card>
                  <CardContent className="p-4">
                    <widget.Chart meter={meter} data={chartData} />
                  </CardContent>
                </Card>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
