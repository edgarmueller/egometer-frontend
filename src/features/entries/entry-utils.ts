import type { Entry } from './types'

export function indexEntriesByMeterAndDate(entries: Entry[] | undefined): Map<string, Entry> {
  const map = new Map<string, Entry>()
  if (!entries) return map
  for (const entry of entries) {
    map.set(`${entry.meterId}|${entry.date}`, entry)
  }
  return map
}

export function entryKey(meterId: string, date: string): string {
  return `${meterId}|${date}`
}
