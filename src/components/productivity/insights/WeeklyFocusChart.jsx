import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function WeeklyFocusChart({ data }) {
  return (
    <div style={{ background: 'var(--bg-soft, #FFFFFF)', borderRadius: 20, padding: 24, border: '1px solid var(--border, #E2E8F0)', height: 320 }}>
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text-dark, #0F172A)', marginBottom: 20 }}>
        📊 Weekly Focus Time
      </h3>

      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #F1F5F9)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted, #64748B)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted, #64748B)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--bg, #18181D)', borderRadius: 12, border: '1px solid var(--border, #2A2A32)', color: 'var(--text-dark, #FFFFFF)', fontSize: 12.5 }}
              formatter={(value) => [`${value} Mins`, 'Focus Time']}
            />
            <Bar dataKey="minutes" fill="#7C3AED" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
