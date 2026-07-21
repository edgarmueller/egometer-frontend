import type { MeterType } from '@/features/meters/meter-types'
import { ActivitiesWidget } from './widgets/activities-widget'
import { BooleanWidget } from './widgets/boolean-widget'
import { MoodWidget } from './widgets/mood-widget'
import { NumberWidget } from './widgets/number-widget'
import { QuantityWidget } from './widgets/quantity-widget'
import { TextWidget } from './widgets/text-widget'
import type { Widget } from './widgets/types'

/**
 * meter.type selects the widget directly — no schema/isApplicable matching
 * like the old app had. Each widget's value type is erased to `unknown`
 * here; callers are expected to only ever feed a widget the value shape its
 * MeterType contract promises (see the API contract in the project README).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const widgetRegistry: Record<MeterType, Widget<any>> = {
  BOOLEAN: BooleanWidget,
  NUMBER: NumberWidget,
  TEXT: TextWidget,
  MOOD: MoodWidget,
  QUANTITY: QuantityWidget,
  ACTIVITIES: ActivitiesWidget,
}
