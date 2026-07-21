import {
  Activity,
  Award,
  Book,
  BookOpen,
  Briefcase,
  Coffee,
  Dumbbell,
  Flame,
  Gauge,
  Gamepad2,
  Heart,
  Moon,
  Music,
  PawPrint,
  Pizza,
  Smile,
  Sparkles,
  Star,
  Sun,
  Target,
  type LucideIcon,
} from 'lucide-react'

/**
 * Curated set of icons a user can pick when creating/editing a meter.
 * The backend stores `icon` as an opaque string key (see the Meter contract);
 * this registry maps that key to a renderable icon component.
 */
export const METER_ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  award: Award,
  book: Book,
  'book-open': BookOpen,
  briefcase: Briefcase,
  coffee: Coffee,
  dumbbell: Dumbbell,
  flame: Flame,
  gauge: Gauge,
  gamepad: Gamepad2,
  heart: Heart,
  moon: Moon,
  music: Music,
  paw: PawPrint,
  pizza: Pizza,
  smile: Smile,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  target: Target,
}

export const METER_ICON_KEYS = Object.keys(METER_ICONS)

export const DEFAULT_METER_ICON = 'star'

export function getMeterIcon(icon: string | undefined | null): LucideIcon {
  return (icon && METER_ICONS[icon]) || METER_ICONS[DEFAULT_METER_ICON]
}
