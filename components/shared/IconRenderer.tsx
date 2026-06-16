import {
  Car, Home, HeartPulse, Shield, Store, Truck, Heart, Scale,
  Compass, Zap, Handshake, MapPin, Star, ArrowRight, ChevronDown,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Car, Home, HeartPulse, Shield, Store, Truck, Heart, Scale,
  Compass, Zap, Handshake, MapPin, Star, ArrowRight, ChevronDown,
}

interface Props {
  name: string
  className?: string
}

export default function IconRenderer({ name, className }: Props) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon className={className} />
}
