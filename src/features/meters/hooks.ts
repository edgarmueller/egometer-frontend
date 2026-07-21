import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { metersApi } from './api'
import type { CreateMeterInput, Meter, UpdateMeterInput } from './meter-types'

export const meterKeys = {
  all: ['meters'] as const,
}

export function useMeters() {
  return useQuery({
    queryKey: meterKeys.all,
    queryFn: metersApi.list,
  })
}

export function useCreateMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateMeterInput) => metersApi.create(input),
    onSuccess: (created) => {
      queryClient.setQueryData<Meter[]>(meterKeys.all, (prev) =>
        prev ? [...prev, created] : [created],
      )
    },
  })
}

export function useUpdateMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMeterInput }) =>
      metersApi.update(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData<Meter[]>(meterKeys.all, (prev) =>
        prev ? prev.map((m) => (m.id === updated.id ? updated : m)) : prev,
      )
    },
  })
}

export function useDeleteMeter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => metersApi.remove(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Meter[]>(meterKeys.all, (prev) =>
        prev ? prev.filter((m) => m.id !== id) : prev,
      )
    },
  })
}
