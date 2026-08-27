import React from 'react'
import { motion } from 'framer-motion'
import { Building2, Sparkles, ArrowUpRight } from 'lucide-react'

export default function FeaturedCompanies({ companies, selectedCompany, onSelectCompany }) {
  return (
    <div style={{ marginTop: 28, marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building2 size={20} style={{ color: '#7C3AED' }} />
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Featured Companies
          </h3>
        </div>
        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
          Filter by company
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 14
      }}>
        {companies.map(c => {
          const isSelected = selectedCompany === c.name
          return (
            <motion.div
              key={c.id}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectCompany(isSelected ? '' : c.name)}
              style={{
                background: isSelected ? c.color : '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                border: isSelected ? `2px solid ${c.accent}` : '1px solid #E2E8F0',
                boxShadow: isSelected ? `0 4px 16px ${c.accent}20` : '0 2px 8px rgba(15, 23, 42, 0.03)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                border: '1px solid #E2E8F0',
                flexShrink: 0
              }}>
                {c.logo}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{c.name}</span>
                  <ArrowUpRight size={13} style={{ color: c.accent, opacity: 0.75, flexShrink: 0 }} />
                </div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 1 }}>
                  {c.openPositions} Openings
                </div>
                <div style={{ fontSize: 9.5, fontWeight: 800, color: c.accent, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  {c.hiringStatus}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
