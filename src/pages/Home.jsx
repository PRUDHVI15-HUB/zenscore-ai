import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeatureGrid from '../components/FeatureGrid'
import WhyUs from '../components/WhyUs'
import Footer from '../components/Footer'

export default function Home() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <>
      <Navbar />
      <Hero />
      <FeatureGrid />
      <WhyUs />
      <Footer />
    </>
  )
}

