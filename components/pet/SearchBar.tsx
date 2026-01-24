'use client'

import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (keyword: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [hotSearches, setHotSearches] = useState<string[]>(['金毛', '拉布拉多', '柯基', '泰迪', '英短', '美短'])

  // 从localStorage获取搜索历史
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // 保存搜索历史到localStorage
  const saveSearchHistory = (searchKeyword: string) => {
    if (!searchKeyword.trim()) return
    
    // 去重并限制最多保存10条
    const newHistory = [
      searchKeyword,
      ...searchHistory.filter(item => item !== searchKeyword)
    ].slice(0, 10)
    
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  // 处理搜索提交
  const handleSearch = () => {
    if (keyword.trim()) {
      onSearch(keyword.trim())
      saveSearchHistory(keyword.trim())
      setShowHistory(false)
    }
  }

  // 处理历史记录点击
  const handleHistoryClick = (item: string) => {
    setKeyword(item)
    onSearch(item)
    setShowHistory(false)
  }

  // 处理热门搜索点击
  const handleHotSearchClick = (item: string) => {
    setKeyword(item)
    onSearch(item)
    saveSearchHistory(item)
    setShowHistory(false)
  }

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  return (
    <div className="relative mb-8">
      <div className="flex gap-2">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="搜索宠物名称或品种..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          
          {/* 搜索历史和热门推荐下拉框 */}
          {showHistory && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              {/* 搜索历史 */}
              {searchHistory.length > 0 && (
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">搜索历史</h3>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(item)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 热门搜索 */}
              <div className="p-3 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">热门搜索</h3>
                <div className="flex flex-wrap gap-2">
                  {hotSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHotSearchClick(item)}
                      className="px-3 py-1 text-sm bg-indigo-50 text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 搜索按钮 */}
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          搜索
        </button>
      </div>
    </div>
  )
}
