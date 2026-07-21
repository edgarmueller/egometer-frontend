import { useNavigate, useParams } from 'react-router-dom'
import {
  addWeeks,
  eachDayOfInterval,
  endOfISOWeek,
  format,
  getISOWeek,
  getISOWeekYear,
  isValid,
  setISOWeek,
  setISOWeekYear,
  startOfISOWeek,
  subWeeks,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { entryKey, indexEntriesByMeterAndDate } from '@/features/entries/entry-utils'
import { useEntries } from '@/features/entries/hooks'
import { widgetRegistry } from '@/features/entries/widget-registry'
import { useMeters } from '@/features/meters/hooks'
import { getMeterIcon } from '@/features/meters/meter-icons'

function resolveWeek(year: string | undefined, week: string | undefined): Date {
  const y = Number(year)
  const w = Number(week)
  if (Number.isInteger(y) && Number.isInteger(w) && w >= 1 && w <= 53) {
    const withYear = setISOWeekYear(new Date(), y)
    const candidate = setISOWeek(withYear, w)
    if (isValid(candidate)) return candidate
  }
  return new Date()
}

export default function WeeklyDashboardPage() {
  const { year, week } = useParams<{ year: string; week: string }>()
  const navigate = useNavigate()

  const weekDate = resolveWeek(year, week)
  const weekStart = startOfISOWeek(weekDate)
  const weekEnd = endOfISOWeek(weekDate)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const from = format(weekStart, 'yyyy-MM-dd')
  const to = format(weekEnd, 'yyyy-MM-dd')

  const { data: meters, isLoading: metersLoading } = useMeters()
  const { data: entries, isLoading: entriesLoading } = useEntries({ from, to })
  const entriesMap = indexEntriesByMeterAndDate(entries)

  const goTo = (d: Date) => navigate(`/weekly/${getISOWeekYear(d)}/${getISOWeek(d)}`)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous week"
          onClick={() => goTo(subWeeks(weekDate, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">
          Week {getISOWeek(weekDate)}, {getISOWeekYear(weekDate)}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
          </span>
        </h1>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next week"
          onClick={() => goTo(addWeeks(weekDate, 1))}
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
          const chartData = weekDays.map((day) => {
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
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd')
                    const entry = entriesMap.get(entryKey(meter.id, dateStr))
                    return (
                      <button
                        key={dateStr}
                        type="button"
                        title={dateStr}
                        onClick={() => navigate(`/daily/${dateStr}`)}
                        className="flex h-14 w-14 flex-col items-center justify-center gap-1 rounded border border-border text-[10px] transition-colors hover:bg-accent"
                      >
                        <span className="leading-none text-muted-foreground">
                          {format(day, 'EEE d')}
                        </span>
                        <span className="flex h-4 w-4 items-center justify-center">
                          <widget.Cell meter={meter} value={entry?.value} />
                        </span>
                      </button>
                    )
                  })}
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
