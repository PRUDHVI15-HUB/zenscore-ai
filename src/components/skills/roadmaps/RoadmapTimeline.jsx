import React from 'react'
import { motion } from 'framer-motion'
import RoadmapStep from './RoadmapStep'

/**
 * RoadmapTimeline Component
 * Vertical learning timeline containing all modules for the selected roadmap.
 *
 * Props:
 * - modules: Array of RoadmapModule objects
 * - onModuleAction: function(module)
 */

export default React.memo(function RoadmapTimeline({ modules = [], onModuleAction }) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-sm">
        No modules specified for this roadmap timeline yet.
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-1"
    >
      {modules.map((module, index) => (
        <RoadmapStep
          key={module.id || index}
          module={module}
          index={index}
          isLast={index === modules.length - 1}
          onModuleAction={onModuleAction}
        />
      ))}
    </motion.div>
  )
})
