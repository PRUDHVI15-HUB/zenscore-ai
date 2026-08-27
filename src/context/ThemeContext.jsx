import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zenscore_theme')
      if (saved === 'dark' || saved === 'light') return saved
    }
    return 'light'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenscore_theme', theme)
      const root = document.documentElement
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark')
        root.classList.add('dark')
      } else {
        root.setAttribute('data-theme', 'light')
        root.classList.remove('dark')
      }
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
