import React, { useState, useMemo } from 'react'
import RoadmapCard from './RoadmapCard'
import RoadmapProgress from './RoadmapProgress'
import RoadmapTimeline from './RoadmapTimeline'
import RoadmapSkeleton from './RoadmapSkeleton'
import EmptyRoadmaps from './EmptyRoadmaps'
import ErrorRoadmaps from './ErrorRoadmaps'
import { Map, Layers } from 'lucide-react'

/**
 * Production RoadmapsSection Component (Step 8 - Production Roadmap Engine)
 * Fully dynamic roadmap container displaying backend MongoDB roadmaps, prerequisite node unlocks, and real progress percentage.
 */

export default function RoadmapsSection({
  roadmaps = null,
  selectedRoadmapId = null,
  loading = false,
  error = null,
  onSelectRoadmap,
  onModuleAction,
  onExplore,
  onRetry
}) {

  // Normalize backend roadmaps
  const formattedRoadmaps = useMemo(() => {
    if (!Array.isArray(roadmaps) || roadmaps.length === 0) return []

    return roadmaps.map(item => {
      const rm = item.roadmap || item
      const nodesList = item.nodes || rm.nodes || []
      const progress = item.currentProgressPercentage !== undefined ? item.currentProgressPercentage : (rm.progress || 0)
      const completedCount = item.completedNodesCount !== undefined ? item.completedNodesCount : nodesList.filter(n => n.isCompleted).length

      return {
        id: rm.id || rm._id,
        skillId: rm.slug || rm.id || rm._id,
        title: rm.title || 'Skill Roadmap',
        category: rm.category || 'Engineering',
        difficulty: rm.difficulty || 'Intermediate',
        durationWeeks: rm.estimatedWeeks || 12,
        progress,
        completedModules: completedCount,
        totalModules: nodesList.length,
        timeRemaining: `${Math.ceil((rm.estimatedHours || 40) * (1 - progress / 100))} hrs left`,
        icon: rm.icon || '🚀',
        color: '#EFF6FF',
        accent: '#2563EB',
        modules: nodesList.map(n => ({
          id: n.nodeId || n.id,
          linkedSkill: n.linkedSkill,
          title: n.title,
          description: n.description || `Master ${n.title} concepts and hands-on milestones.`,
          duration: `${n.estimatedHours || 10} hrs`,
          status: n.status ? n.status.toLowerCase() : (n.isCompleted ? 'completed' : (n.isUnlocked ? 'current' : 'locked')),
          resources: { videos: 4, readings: 2, exercises: 5, quiz: true, project: false }
        }))
      }
    })
  }, [roadmaps])

  const [activeId, setActiveId] = useState(
    selectedRoadmapId || (formattedRoadmaps.length > 0 ? formattedRoadmaps[0].id : null)
  )

  const activeRoadmap = useMemo(() => {
    if (formattedRoadmaps.length === 0) return null
    return formattedRoadmaps.find(r => r.id === activeId || r.skillId === activeId) || formattedRoadmaps[0]
  }, [formattedRoadmaps, activeId])

  const handleCardSelect = (roadmap) => {
    setActiveId(roadmap.id || roadmap.skillId)
    if (onSelectRoadmap) {
      onSelectRoadmap(roadmap)
    }
  }

  // 1. Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <RoadmapSkeleton />
      </div>
    )
  }

  // 2. Error State
  if (error) {
    return (
      <ErrorRoadmaps
        onRetry={onRetry}
        message={typeof error === 'string' ? error : 'Unable to load roadmaps.'}
      />
    )
  }

  // 3. Empty State
  if (formattedRoadmaps.length === 0) {
    return <EmptyRoadmaps onExplore={onExplore} />
  }

  // 4. Success State
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="font-sora text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="w-5 h-5 text-purple-600" />
            <span>Production Skill Roadmaps</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a pathway to view prerequisite-unlocked nodes, estimated hours, and real-time progress.
          </p>
        </div>

        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 self-start sm:self-auto">
          {formattedRoadmaps.length} Roadmaps Available
        </span>
      </div>

      {/* Roadmap Selector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formattedRoadmaps.map((r) => (
          <RoadmapCard
            key={r.id || r.skillId}
            roadmap={r}
            isSelected={activeRoadmap && (activeRoadmap.id === r.id || activeRoadmap.skillId === r.skillId)}
            onClick={handleCardSelect}
          />
        ))}
      </div>

      {/* Selected Roadmap Timeline Detail View */}
      {activeRoadmap && (
        <div className="pt-4 space-y-6">
          <RoadmapProgress
            roadmap={activeRoadmap}
            onLaunchWorkspace={(rm) => onModuleAction && onModuleAction(null, rm)}
          />

          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-slate-700" />
            <h3 className="font-sora text-lg font-bold text-slate-900">
              Prerequisite Node Timeline & Step-by-Step Path
            </h3>
          </div>

          <RoadmapTimeline
            modules={activeRoadmap.modules || []}
            onModuleAction={(module) => onModuleAction && onModuleAction(module, activeRoadmap)}
          />
        </div>
      )}
    </div>
  )
}
