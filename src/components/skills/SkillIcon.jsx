import React from 'react'
import {
  Brain,
  Layers,
  Cloud,
  Server,
  Layout,
  Code2,
  Database,
  Terminal,
  FileCode,
  Globe,
  Cpu,
  Boxes,
  Zap,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Atom
} from 'lucide-react'

/**
 * SkillIcon Component
 * Resolves any skill name, category, slug, or icon key into a dedicated,
 * beautifully styled Lucide SVG icon with matching background palette.
 * Completely prevents raw strings ("brain", "layers", etc.) from displaying as text.
 */
export default function SkillIcon({
  name = '',
  category = '',
  icon = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  className = ''
}) {
  const query = `${name} ${category} ${icon}`.toLowerCase()

  let IconComponent = BookOpen
  let bgGradient = 'bg-purple-50 text-purple-600 border-purple-100'

  if (query.includes('python') || query.includes('ai') || query.includes('machine') || query.includes('brain') || query.includes('data')) {
    IconComponent = Brain
    bgGradient = 'bg-pink-50 text-pink-600 border-pink-100'
  } else if (query.includes('react') || query.includes('next') || query.includes('frontend') || query.includes('ui')) {
    IconComponent = Code2
    bgGradient = 'bg-blue-50 text-blue-600 border-blue-100'
  } else if (query.includes('docker') || query.includes('devops') || query.includes('cloud') || query.includes('kubernetes') || query.includes('container')) {
    IconComponent = Cloud
    bgGradient = 'bg-sky-50 text-sky-600 border-sky-100'
  } else if (query.includes('node') || query.includes('express') || query.includes('backend') || query.includes('server') || query.includes('api')) {
    IconComponent = Server
    bgGradient = 'bg-emerald-50 text-emerald-600 border-emerald-100'
  } else if (query.includes('mongo') || query.includes('database') || query.includes('sql') || query.includes('nosql') || query.includes('db')) {
    IconComponent = Database
    bgGradient = 'bg-teal-50 text-teal-600 border-teal-100'
  } else if (query.includes('typescript') || query.includes('ts') || query.includes('javascript') || query.includes('js')) {
    IconComponent = FileCode
    bgGradient = 'bg-indigo-50 text-indigo-600 border-indigo-100'
  } else if (query.includes('full stack') || query.includes('mern') || query.includes('layers')) {
    IconComponent = Layers
    bgGradient = 'bg-purple-50 text-purple-600 border-purple-100'
  } else if (query.includes('dsa') || query.includes('algo') || query.includes('zap')) {
    IconComponent = Zap
    bgGradient = 'bg-amber-50 text-amber-600 border-amber-100'
  } else if (query.includes('security') || query.includes('shield')) {
    IconComponent = ShieldCheck
    bgGradient = 'bg-rose-50 text-rose-600 border-rose-100'
  } else if (query.includes('layout')) {
    IconComponent = Layout
    bgGradient = 'bg-blue-50 text-blue-600 border-blue-100'
  }

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  }

  const containerSize = sizeClasses[size] || sizeClasses.md
  const iconSize = iconSizes[size] || iconSizes.md

  return (
    <div
      className={`${containerSize} flex items-center justify-center shrink-0 border shadow-xs ${bgGradient} ${className}`}
    >
      <IconComponent className={`${iconSize} stroke-[2.2]`} />
    </div>
  )
}
