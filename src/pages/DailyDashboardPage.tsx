import { useNavigate, useParams } from 'react-router-dom'
import { addDays, format, isValid, parseISO, subDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { entryKey, indexEntriesByMeterAndDate } from '@/features/entries/entry-utils'
import { useEntries, useUpsertEntry } from '@/features/entries/hooks'
import { widgetRegistry } from '@/features/entries/widget-registry'
import { useMeters } from '@/features/meters/hooks'
import { getMeterIcon } from '@/features/meters/meter-icons'

function resolveDate(param: string | undefined): string {
  if (param) {
    const parsed = parseISO(param)
    if (isValid(parsed)) return param
  }
  return format(new Date(), 'yyyy-MM-dd')
}

export default function DailyDashboardPage() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()

  const currentDate = resolveDate(date)

  const { data: meters, isLoading: metersLoading } = useMeters()
  const { data: entries, isLoading: entriesLoading } = useEntries({
    from: currentDate,
    to: currentDate,
  })
  const upsertEntry = useUpsertEntry()

  const entriesMap = indexEntriesByMeterAndDate(entries)

  const goTo = (d: Date) => navigate(`/daily/${format(d, 'yyyy-MM-dd')}`)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous day"
          onClick={() => goTo(subDays(parseISO(currentDate), 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center gap-1">
          <input
            type="date"
            value={currentDate}
            onChange={(e) => e.target.value && goTo(parseISO(e.target.value))}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
          />
          <span className="text-sm text-muted-foreground">
            {format(parseISO(currentDate), 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next day"
          onClick={() => goTo(addDays(parseISO(currentDate), 1))}
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

      <div className="flex flex-col gap-4">
        {meters?.map((meter) => {
          const widget = widgetRegistry[meter.type]
          const Icon = getMeterIcon(meter.icon)
          const entry = entriesMap.get(entryKey(meter.id, currentDate))

          return (
            <Card key={meter.id}>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${meter.color}26`, color: meter.color }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium">{meter.name}</span>
                </div>
                <widget.DayInput
                  meter={meter}
                  value={entry?.value}
                  onChange={(value) =>
                    upsertEntry.mutate({ meterId: meter.id, date: currentDate, value })
                  }
                  disabled={upsertEntry.isPending}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
