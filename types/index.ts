export interface CoverageItem {
  slug: string
  name: string
  icon: string
  bg: string
}

export interface ReviewItem {
  name: string
  initials: string
  rating: number
  text: string
}

export interface StatItem {
  value: string
  label: string
}

export interface WhyUsItem {
  icon: string
  title: string
  desc: string
}

export interface BranchInfo {
  address: string
  phones: string[]
  cell: string
  email: string
}
