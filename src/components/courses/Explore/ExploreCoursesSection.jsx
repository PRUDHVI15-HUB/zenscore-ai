import React, { useState, useMemo } from 'react'
import CourseCard from './CourseCard'
import { Search, Layers } from 'lucide-react'

const categoriesList = [
  { id: 'all', label: 'All Courses', icon: '⚡' },
  { id: 'programming', label: 'Programming', icon: '💻' },
  { id: 'datascience', label: 'Data Science', icon: '📊' },
  { id: 'devops', label: 'DevOps', icon: '♾️' },
  { id: 'cloud', label: 'Cloud Computing', icon: '☁️' },
  { id: 'aiml', label: 'AI & ML', icon: '🤖' }
]

export default function ExploreCoursesSection({
  courses = [],
  loading = false,
  error = null,
  onCourseClick,
  onBookmark,
  onEnroll,
  onRetry
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = search === '' ||
        (c.title || c.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(search.toLowerCase())

      const matchCat = selectedCategory === 'all' ||
        (c.category || '').toLowerCase() === selectedCategory.toLowerCase()

      const matchDiff = selectedDifficulty === 'all' ||
        (c.difficulty || '').toLowerCase() === selectedDifficulty.toLowerCase()

      return matchSearch && matchCat && matchDiff
    })
  }, [courses, search, selectedCategory, selectedDifficulty])

  return (
    <div className="space-y-6">
      {/* SEARCH AND CATEGORY FILTERS BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course specializations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sora font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="font-sora text-sm font-bold text-slate-800">No Courses Found</h4>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id || course.id}
              course={course}
              onCourseClick={onCourseClick}
              onBookmark={onBookmark}
              onEnroll={onEnroll}
            />
          ))}
        </div>
      )}
    </div>
  )
}
