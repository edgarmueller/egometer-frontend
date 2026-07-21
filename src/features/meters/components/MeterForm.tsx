import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { METER_ICON_KEYS, getMeterIcon } from '../meter-icons'
import { METER_TYPES, METER_TYPE_DESCRIPTIONS, METER_TYPE_LABELS } from '../meter-types'
import type { CreateMeterInput, Meter } from '../meter-types'

export const COLOR_PRESETS = [
  '#6d5efc',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
]

const optionalPositiveNumber = z.preprocess((val) => {
  if (val === '' || val === undefined || val === null) return undefined
  return val
}, z.coerce.number().positive('Must be greater than 0').optional())

const meterFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(60, 'Keep it under 60 characters'),
  type: z.enum(['BOOLEAN', 'NUMBER', 'TEXT', 'MOOD', 'QUANTITY', 'ACTIVITIES']),
  color: z.string().min(1, 'Pick a color'),
  icon: z.string().min(1, 'Pick an icon'),
  dailyGoal: optionalPositiveNumber,
  weeklyGoal: optionalPositiveNumber,
})

export type MeterFormValues = z.infer<typeof meterFormSchema>

interface MeterFormProps {
  meter?: Meter
  onSubmit: (input: CreateMeterInput) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export function MeterForm({
  meter,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save meter',
}: MeterFormProps) {
  const form = useForm<MeterFormValues>({
    resolver: zodResolver(meterFormSchema),
    defaultValues: {
      name: meter?.name ?? '',
      type: meter?.type ?? 'BOOLEAN',
      color: meter?.color ?? COLOR_PRESETS[0],
      icon: meter?.icon ?? METER_ICON_KEYS[0],
      dailyGoal: meter?.dailyGoal,
      weeklyGoal: meter?.weeklyGoal,
    },
  })

  const handleSubmit = (values: MeterFormValues) => {
    onSubmit({
      name: values.name.trim(),
      type: values.type,
      color: values.color,
      icon: values.icon,
      dailyGoal: values.dailyGoal,
      weeklyGoal: values.weeklyGoal,
    })
  }

  const selectedColor = form.watch('color')
  const selectedIcon = form.watch('icon')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Meditation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {METER_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {METER_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {METER_TYPE_DESCRIPTIONS[field.value]}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={() => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Select color ${color}`}
                    onClick={() => form.setValue('color', color, { shouldValidate: true })}
                    className={cn(
                      'h-7 w-7 rounded-full border-2 transition-transform hover:scale-110',
                      selectedColor === color ? 'border-foreground' : 'border-transparent',
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  aria-label="Custom color"
                  value={selectedColor}
                  onChange={(e) =>
                    form.setValue('color', e.target.value, { shouldValidate: true })
                  }
                  className="h-7 w-7 cursor-pointer rounded-full border border-input bg-transparent p-0"
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={() => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <div className="grid grid-cols-10 gap-2">
                {METER_ICON_KEYS.map((key) => {
                  const Icon = getMeterIcon(key)
                  const isSelected = selectedIcon === key
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-label={`Select icon ${key}`}
                      onClick={() => form.setValue('icon', key, { shouldValidate: true })}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input text-muted-foreground hover:bg-accent',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dailyGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily goal (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    placeholder="e.g. 1"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weeklyGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekly goal (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="any"
                    placeholder="e.g. 5"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </form>
    </Form>
  )
}
