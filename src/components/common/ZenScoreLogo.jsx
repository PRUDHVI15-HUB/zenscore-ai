import React from 'react'
import { Link } from 'react-router-dom'
import ZenScoreIcon from './ZenScoreIcon'

export default function ZenScoreLogo({ size = 34, showText = true, to = '/', style = {}, textStyle = {}, light = false }) {
  const content = (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, ...style }}>
      <ZenScoreIcon size={size} />
      {showText && (
        <span style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 800,
          fontSize: Math.max(15, size * 0.52),
          color: light ? '#FFFFFF' : '#0F172A',
          letterSpacing: '-0.3px',
          lineHeight: 1,
          ...textStyle
        }}>
          ZenScore <span style={{ color: light ? '#38BDF8' : '#7C3AED' }}>AI</span>
        </span>
      )}
    </div>
  )

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
        {content}
      </Link>
    )
  }

  return content
}
