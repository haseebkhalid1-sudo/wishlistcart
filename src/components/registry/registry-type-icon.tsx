import {
  Heart,
  Smile,
  Gift,
  Star,
  Home,
  BookOpen,
  Sparkles,
  GraduationCap,
} from 'lucide-react'

export function getEventTypeLabel(eventType: string): string {
  switch (eventType) {
    case 'WEDDING':
      return 'Wedding'
    case 'BABY_SHOWER':
      return 'Baby Shower'
    case 'BIRTHDAY':
      return 'Birthday'
    case 'HOLIDAY':
      return 'Holiday'
    case 'HOUSEWARMING':
      return 'Housewarming'
    case 'GRADUATION':
      return 'Graduation'
    case 'ANNIVERSARY':
      return 'Anniversary'
    case 'BACK_TO_SCHOOL':
      return 'Back to School'
    case 'CUSTOM':
      return 'Custom'
    default:
      return 'Registry'
  }
}

interface RegistryTypeIconProps {
  eventType: string
  className?: string
}

export function RegistryTypeIcon({ eventType, className }: RegistryTypeIconProps) {
  const props = { className, strokeWidth: 1.5 }

  switch (eventType) {
    case 'WEDDING':
      return <Heart {...props} />
    case 'BABY_SHOWER':
      return <Smile {...props} />
    case 'BIRTHDAY':
      return <Gift {...props} />
    case 'HOLIDAY':
      return <Star {...props} />
    case 'HOUSEWARMING':
      return <Home {...props} />
    case 'GRADUATION':
      return <GraduationCap {...props} />
    case 'ANNIVERSARY':
      return <Heart {...props} />
    case 'BACK_TO_SCHOOL':
      return <BookOpen {...props} />
    case 'CUSTOM':
      return <Sparkles {...props} />
    default:
      return <Gift {...props} />
  }
}
