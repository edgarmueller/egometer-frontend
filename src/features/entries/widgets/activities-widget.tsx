import {
  BookOpen,
  Briefcase,
  Film,
  GraduationCap,
  Bike,
  Gamepad2,
  Heart,
  HeartPulse,
  Home,
  Leaf,
  PartyPopper,
  Plane,
  ShoppingBag,
  Star,
  Sun,
  Thermometer,
  Trash2,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import { Cell as RechartsCell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { cn } from '@/lib/utils'
import {
  ACTIVITY_TAGS,
  ACTIVITY_TAG_LABELS,
  type ActivityTag,
} from '@/features/meters/meter-types'
import type { ChartProps, CellProps, DayInputProps, Widget } from './types'

const ACTIVITY_ICONS: Record<ActivityTag, LucideIcon> = {
  work: Briefcase,
  chill: Sun,
  friends: Users,
  love: Heart,
  sports: Bike,
  party: PartyPopper,
  movies: Film,
  reading: BookOpen,
  gaming: Gamepad2,
  shopping: ShoppingBag,
  traveling: Plane,
  food: UtensilsCrossed,
  nature: Leaf,
  cleaning: Trash2,
  pet_project: Star,
  family: Home,
  sick: Thermometer,
  learning: GraduationCap,
  health: HeartPulse,
}

const PIE_COLORS = [
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
  '#84cc16',
  '#06b6d4',
  '#a855f7',
  '#f43f5e',
  '#0ea5e9',
  '#d946ef',
  '#65a30d',
  '#ea580c',
  '#0891b2',
]

function DayInput({ value, onChange, disabled }: DayInputProps<string[]>) {
  const selected = value ?? []

  const toggle = (tag: ActivityTag) => {
    const next = selected.includes(tag)
      ? selected.filter((t) => t !== tag)
      : [...selected, tag]
    onChange(next)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ACTIVITY_TAGS.map((tag) => {
        const Icon = ACTIVITY_ICONS[tag]
        const isSelected = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            disabled={disabled}
            onClick={() => toggle(tag)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50',
              isSelected
                ? 'border-transparent bg-primary text-primary-foreground'
                : 'border-input text-muted-foreground hover:bg-accent',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {ACTIVITY_TAG_LABELS[tag]}
          </button>
        )
      })}
    </div>
  )
}

function Cell({ value }: CellProps<string[]>) {
  const tags = value ?? []
  if (tags.length === 0) return <div className="h-full w-full rounded" />
  const shown = tags.slice(0, 3)
  return (
    <div
      className="flex h-full w-full items-center justify-center gap-0.5 rounded"
      title={tags.map((t) => ACTIVITY_TAG_LABELS[t as ActivityTag] ?? t).join(', ')}
    >
      {shown.map((tag) => {
        const Icon = ACTIVITY_ICONS[tag as ActivityTag]
        return Icon ? <Icon key={tag} className="h-3 w-3 text-muted-foreground" /> : null
      })}
      {tags.length > shown.length && (
        <span className="text-[10px] text-muted-foreground">+{tags.length - shown.length}</span>
      )}
    </div>
  )
}

function Chart({ data }: ChartProps<string[]>) {
  const counts = new Map<string, number>()
  for (const d of data) {
    for (const tag of d.value ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  const chartData = Array.from(counts.entries())
    .map(([tag, count]) => ({
      tag,
      label: ACTIVITY_TAG_LABELS[tag as ActivityTag] ?? tag,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  if (chartData.length === 0) {
    return <p className="text-sm text-muted-foreground">No activities logged in this period.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="label"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <RechartsCell key={entry.tag} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export const ActivitiesWidget: Widget<string[]> = { DayInput, Cell, Chart }
