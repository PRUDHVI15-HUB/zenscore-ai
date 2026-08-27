import React from 'react'
import { motion } from 'framer-motion'
import SkillCard from './SkillCard'

/**
 * SkillGrid Component
 * Responsive 3-col desktop / 2-col tablet / 1-col mobile grid with stagger entrance.
 *
 * Props:
 * - skills: Array of Skill objects
 * - onSkillClick: function(skill)
 */

export default React.memo(function SkillGrid({ skills = [], onSkillClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {skills.map((skill) => (
        <motion.div key={skill.id || skill.title} variants={itemVariants} className="h-full">
          <SkillCard skill={skill} onClick={onSkillClick} />
        </motion.div>
      ))}
    </motion.div>
  )
})
