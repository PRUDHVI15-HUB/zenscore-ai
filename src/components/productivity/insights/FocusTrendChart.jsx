import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function FocusTrendChart({ data }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', height: 320 }}>
      <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>
        📈 Daily Focus Trend (Last 30 Days)
      </h3>

      <div style={{ width: '100%', height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0F172A', borderRadius: 12, border: 'none', color: '#FFFFFF', fontSize: 12.5 }}
              formatter={(value) => [`${value} Mins`, 'Focus Time']}
            />
            <Area type="monotone" dataKey="minutes" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#trendGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
