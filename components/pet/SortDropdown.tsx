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
    <div className="flex items-center gap-2 mb-8">
      <span className="text-gray-600 text-sm">排序方式：</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
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
