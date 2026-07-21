export type MeterType = 'BOOLEAN' | 'NUMBER' | 'TEXT' | 'MOOD' | 'QUANTITY' | 'ACTIVITIES'

export interface Meter {
  id: string
  name: string
  type: MeterType
  color: string
  icon: string
  dailyGoal?: number
  weeklyGoal?: number
  sortOrder: number
  userId: string
}

export interface CreateMeterInput {
  name: string
  type: MeterType
  color: string
  icon: string
  dailyGoal?: number
  weeklyGoal?: number
}

export type UpdateMeterInput = Partial<CreateMeterInput>

export const METER_TYPES: MeterType[] = [
  'MOOD',
  'TEXT',
  'ACTIVITIES',
  'QUANTITY',
  'BOOLEAN',
  'NUMBER',
]

export const METER_TYPE_LABELS: Record<MeterType, string> = {
  MOOD: 'Mood',
  TEXT: 'Journal',
  ACTIVITIES: 'Activities',
  QUANTITY: 'Quantity',
  BOOLEAN: 'Yes / No',
  NUMBER: 'Number',
}

export const METER_TYPE_DESCRIPTIONS: Record<MeterType, string> = {
  MOOD: 'How you felt today, on a five-point scale',
  TEXT: 'A free-form journal entry',
  ACTIVITIES: 'Which activities you did today, multi-select',
  QUANTITY: 'A rough amount: none, a bit, or a lot',
  BOOLEAN: 'A simple yes/no for whether you did something',
  NUMBER: 'A numeric value, e.g. glasses of water',
}

/** Fixed vocabulary for MOOD-typed entries, worst to best. */
export const MOOD_VALUES = ['bad', 'down', 'okayish', 'good', 'dabomb'] as const
export type MoodValue = (typeof MOOD_VALUES)[number]

export const MOOD_LABELS: Record<MoodValue, string> = {
  bad: 'Awful',
  down: 'Down',
  okayish: 'Okayish',
  good: 'Good',
  dabomb: 'Superduper',
}

/** Fixed vocabulary for QUANTITY-typed entries. */
export const QUANTITY_VALUES = ['none', 'a_bit', 'a_lot'] as const
export type QuantityValue = (typeof QUANTITY_VALUES)[number]

export const QUANTITY_LABELS: Record<QuantityValue, string> = {
  none: 'None',
  a_bit: 'A bit',
  a_lot: 'A lot',
}

/** Fixed tag vocabulary for ACTIVITIES-typed entries. */
export const ACTIVITY_TAGS = [
  'work',
  'chill',
  'friends',
  'love',
  'sports',
  'party',
  'movies',
  'reading',
  'gaming',
  'shopping',
  'traveling',
  'food',
  'nature',
  'cleaning',
  'pet_project',
  'family',
  'sick',
  'learning',
  'health',
] as const
export type ActivityTag = (typeof ACTIVITY_TAGS)[number]

export const ACTIVITY_TAG_LABELS: Record<ActivityTag, string> = {
  work: 'Work',
  chill: 'Chill',
  friends: 'Friends',
  love: 'Love',
  sports: 'Sports',
  party: 'Party',
  movies: 'Movies',
  reading: 'Reading',
  gaming: 'Gaming',
  shopping: 'Shopping',
  traveling: 'Traveling',
  food: 'Food',
  nature: 'Nature',
  cleaning: 'Cleaning',
  pet_project: 'Pet project',
  family: 'Family',
  sick: 'Sick',
  learning: 'Learning',
  health: 'Health',
}
