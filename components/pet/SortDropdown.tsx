'use client'

interface SortDropdownProps {
  onSortChange: (sortBy: string) => void
  currentSort: string
}

export default function SortDropdown({ onSortChange, currentSort }: SortDropdownProps) {
  const sortOptions = [
    { value: 'newest', label: '最新发布' },
    { value: 'oldest', label: '最早发布' },
    { value: 'most_viewed', label: '最多浏览' },
    { value: 'least_viewed', label: '最少浏览' }
  ]

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground font-medium">排序方式：</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2.5 border border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground shadow-sm hover:shadow-md transition-shadow min-w-[120px]"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
