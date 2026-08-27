import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#EC4899', '#0284C7', '#8B5CF6', '#64748B']

export default function ModuleDistributionChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 20, padding: 24, border: '1px solid var(--border, #E2E8F0)', height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ fontSize: 24, marginBottom: 8 }}>🍕</span>
        <div style={{ fontSize: 13, color: 'var(--text-muted, #64748B)', fontWeight: 600 }}>No Module Data Logged</div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 20, padding: 24, border: '1px solid var(--border, #E2E8F0)', height: 320 }}>
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-dark, #0F172A)', marginBottom: 10 }}>
        🍕 Study Module Distribution
      </h3>

      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="minutes"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'var(--bg, #18181D)', borderRadius: 12, border: '1px solid var(--border, #2A2A32)', color: 'var(--text-dark, #FFFFFF)', fontSize: 12.5 }}
              formatter={(value, name, item) => [`${value} Mins (${item.payload.percentage}%)`, item.payload.name]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: 11.5, fontFamily: 'DM Sans, sans-serif', paddingTop: 10 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
