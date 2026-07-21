import { apiClient } from '@/lib/api-client'
import type { CreateMeterInput, Meter, UpdateMeterInput } from './meter-types'

export const metersApi = {
  list: () => apiClient.get<Meter[]>('/meters'),
  create: (input: CreateMeterInput) => apiClient.post<Meter>('/meters', input),
  update: (id: string, input: UpdateMeterInput) =>
    apiClient.patch<Meter>(`/meters/${id}`, input),
  remove: (id: string) => apiClient.delete<void>(`/meters/${id}`),
}
