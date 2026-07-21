import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateMeter, useDeleteMeter, useMeters, useUpdateMeter } from '../hooks'
import { getMeterIcon } from '../meter-icons'
import { METER_TYPE_LABELS } from '../meter-types'
import type { CreateMeterInput, Meter } from '../meter-types'
import { MeterForm } from './MeterForm'

export function MeterList() {
  const { data: meters, isLoading, isError } = useMeters()
  const createMeter = useCreateMeter()
  const updateMeter = useUpdateMeter()
  const deleteMeter = useDeleteMeter()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingMeter, setEditingMeter] = useState<Meter | null>(null)
  const [deletingMeter, setDeletingMeter] = useState<Meter | null>(null)

  const handleCreate = (input: CreateMeterInput) => {
    createMeter.mutate(input, {
      onSuccess: () => setIsCreateOpen(false),
    })
  }

  const handleUpdate = (input: CreateMeterInput) => {
    if (!editingMeter) return
    updateMeter.mutate(
      { id: editingMeter.id, input },
      { onSuccess: () => setEditingMeter(null) },
    )
  }

  const handleDelete = () => {
    if (!deletingMeter) return
    deleteMeter.mutate(deletingMeter.id, {
      onSuccess: () => setDeletingMeter(null),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Meters</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add meter
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add meter</DialogTitle>
            </DialogHeader>
            <MeterForm
              onSubmit={handleCreate}
              isSubmitting={createMeter.isPending}
              submitLabel="Create meter"
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading meters…</p>}
      {isError && (
        <p className="text-sm text-destructive">Could not load meters. Please retry.</p>
      )}
      {meters && meters.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You don&apos;t have any meters yet. Add one to start tracking.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {meters?.map((meter) => {
          const Icon = getMeterIcon(meter.icon)
          return (
            <Card key={meter.id}>
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${meter.color}26`, color: meter.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium leading-tight">{meter.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {METER_TYPE_LABELS[meter.type]}
                    </p>
                    {(meter.dailyGoal || meter.weeklyGoal) && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {meter.dailyGoal ? `Daily goal: ${meter.dailyGoal}` : null}
                        {meter.dailyGoal && meter.weeklyGoal ? ' · ' : null}
                        {meter.weeklyGoal ? `Weekly goal: ${meter.weeklyGoal}` : null}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${meter.name}`}
                    onClick={() => setEditingMeter(meter)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${meter.name}`}
                    onClick={() => setDeletingMeter(meter)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={editingMeter !== null} onOpenChange={(open) => !open && setEditingMeter(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingMeter?.name}</DialogTitle>
          </DialogHeader>
          {editingMeter && (
            <MeterForm
              meter={editingMeter}
              onSubmit={handleUpdate}
              isSubmitting={updateMeter.isPending}
              submitLabel="Save changes"
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deletingMeter !== null}
        onOpenChange={(open) => !open && setDeletingMeter(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deletingMeter?.name}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the meter and cannot be undone. Entries logged
            against it will no longer be shown.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingMeter(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMeter.isPending}
            >
              {deleteMeter.isPending ? 'Deleting…' : 'Delete meter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
