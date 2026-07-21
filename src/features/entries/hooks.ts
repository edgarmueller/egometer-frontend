import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { entriesApi } from './api'
import type { DateRange, Entry } from './types'

export const entryKeys = {
  all: ['entries'] as const,
  range: (range: DateRange) => ['entries', range.from, range.to] as const,
}

export function useEntries(range: DateRange) {
  return useQuery({
    queryKey: entryKeys.range(range),
    queryFn: () => entriesApi.list(range),
  })
}

interface UpsertEntryVars {
  meterId: string
  date: string
  value: unknown
}

export function useUpsertEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ meterId, date, value }: UpsertEntryVars) =>
      entriesApi.upsert(meterId, date, value),

    // Optimistically patch every cached entries range that might contain
    // this date, so daily/monthly/weekly views all update immediately.
    onMutate: async ({ meterId, date, value }) => {
      await queryClient.cancelQueries({ queryKey: entryKeys.all })

      const previous = queryClient.getQueriesData<Entry[]>({ queryKey: entryKeys.all })

      queryClient.setQueriesData<Entry[]>({ queryKey: entryKeys.all }, (old) => {
        if (!old) return old
        const index = old.findIndex((e) => e.meterId === meterId && e.date === date)
        if (index >= 0) {
          const next = [...old]
          next[index] = { ...next[index], value }
          return next
        }
        return [...old, { id: `optimistic-${meterId}-${date}`, meterId, date, value }]
      })

      return { previous }
    },
    onError: (_err, _vars, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: entryKeys.all })
    },
  })
}

export function useDeleteEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => entriesApi.remove(id),
    onSuccess: (_data, id) => {
      queryClient.setQueriesData<Entry[]>({ queryKey: entryKeys.all }, (old) =>
        old ? old.filter((e) => e.id !== id) : old,
      )
    },
  })
}
