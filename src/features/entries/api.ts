import { apiClient } from '@/lib/api-client'
import type { DateRange, Entry } from './types'

export const entriesApi = {
  list: ({ from, to }: DateRange) =>
    apiClient.get<Entry[]>(`/entries?from=${from}&to=${to}`),
  upsert: (meterId: string, date: string, value: unknown) =>
    apiClient.put<Entry>(`/entries/${meterId}/${date}`, { value }),
  remove: (id: string) => apiClient.delete<void>(`/entries/${id}`),
}
