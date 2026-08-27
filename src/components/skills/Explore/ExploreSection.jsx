import React, { useState, useMemo, useCallback } from 'react'
import SearchBar from './SearchBar'
import FilterBar from './FilterBar'
import SkillGrid from './SkillGrid'
import SkillSkeleton from './SkillSkeleton'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'

/**
 * ExploreSection Component
 * Master container orchestrating Search, Filters, Grid, Loading, Empty, and Error states.
 */

export default function ExploreSection({
  skills = [],
  categories = [],
  loading = false,
  error = null,
  onSkillClick,
  onBookmark,
  onEnroll,
  onRetry
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Dynamically compute category names list from MongoDB seeded categories or loaded skills
  const categoryNames = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      const names = categories.map(c => (typeof c === 'object' ? c.name : c)).filter(Boolean)
      return ['All', ...Array.from(new Set(names))]
    }
    if (Array.isArray(skills) && skills.length > 0) {
      const names = skills.map(s => (typeof s.category === 'object' ? s.category?.name : s.category)).filter(Boolean)
      return ['All', ...Array.from(new Set(names))]
    }
    return [
      'All',
      'Programming Languages',
      'Frontend Development',
      'Backend Development',
      'Databases',
      'DevOps',
      'Cloud Computing',
      'Artificial Intelligence',
      'Computer Science Fundamentals',
      'Mobile Development',
      'Developer Tools'
    ]
  }, [categories, skills])

  // Search input change handler
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  // Filter change handlers
  const handleDifficultyChange = useCallback((difficulty) => {
    setSelectedDifficulty(difficulty)
  }, [])

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
  }, [])

  // Reset all filters & search
  const handleClearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedDifficulty('All')
    setSelectedCategory('All')
  }, [])

  // High-performance memoized skill filtering
  const filteredSkills = useMemo(() => {
    if (!Array.isArray(skills)) return []

    return skills.filter((skill) => {
      // 1. Difficulty Filter
      if (selectedDifficulty !== 'All' && skill.difficulty?.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false
      }

      // 2. Category Filter
      if (selectedCategory !== 'All') {
        const catName = typeof skill.category === 'object' ? skill.category?.name : skill.category
        if (catName?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false
        }
      }

      // 3. Search Query (Title, Category, Short Description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const titleMatch = skill.title?.toLowerCase().includes(q) || skill.name?.toLowerCase().includes(q)
        const catName = typeof skill.category === 'object' ? skill.category?.name : skill.category
        const catMatch = catName?.toLowerCase().includes(q)
        const descMatch = (skill.shortDescription || skill.description)?.toLowerCase().includes(q)
        return titleMatch || catMatch || descMatch
      }

      return true
    })
  }, [skills, selectedDifficulty, selectedCategory, searchQuery])

  return (
    <div className="space-y-6">
      {/* Top Header Controls: Title + Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="font-sora text-xl font-extrabold text-slate-900 tracking-tight">
            Explore Skill Categories
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover in-demand tech skills, curated roadmaps, and hands-on projects.
          </p>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search skills..."
        />
      </div>

      {/* Filter Chips Bar */}
      <FilterBar
        selectedDifficulty={selectedDifficulty}
        selectedCategory={selectedCategory}
        categories={categoryNames}
        onDifficultyChange={handleDifficultyChange}
        onCategoryChange={handleCategoryChange}
      />

      {/* Results Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Showing <strong className="text-slate-900 font-bold">{filteredSkills.length}</strong> {filteredSkills.length === 1 ? 'skill' : 'skills'}
        </span>

        {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchQuery) && (
          <button
            onClick={handleClearFilters}
            className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer underline underline-offset-2"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* State Rendering */}
      {loading ? (
        <SkillSkeleton count={6} />
      ) : error ? (
        <ErrorState onRetry={onRetry} message={typeof error === 'string' ? error : 'Unable to load skills.'} />
      ) : filteredSkills.length === 0 ? (
        <EmptyState onClearFilters={handleClearFilters} />
      ) : (
        <SkillGrid skills={filteredSkills} onSkillClick={onSkillClick} onBookmark={onBookmark} onEnroll={onEnroll} />
      )}
    </div>
  )
}
