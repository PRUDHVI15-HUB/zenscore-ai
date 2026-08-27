import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

export default function HealthTimelineChart({ data }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 340, marginBottom: 28 }}>
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>
        📈 Health & Consistency Timeline (Last 30 Days)
      </h3>

      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0F172A', borderRadius: 12, border: 'none', color: '#FFFFFF', fontSize: 12.5 }}
              formatter={(value, name) => [`${value} / 100`, name === 'healthScore' ? 'Health Score' : 'Consistency']}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: 12, fontFamily: 'Sora, sans-serif', paddingBottom: 10 }}
            />
            <Line type="monotone" dataKey="healthScore" name="Health Score" stroke="#059669" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="consistency" name="Consistency" stroke="#7C3AED" strokeWidth={2.5} dot={false} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
