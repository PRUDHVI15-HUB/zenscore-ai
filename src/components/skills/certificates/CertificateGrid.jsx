import React from 'react'
import { motion } from 'framer-motion'
import CertificateCard from './CertificateCard'

/**
 * CertificateGrid Component
 * Responsive 3-col desktop / 2-col tablet / 1-col mobile grid with stagger animation.
 *
 * Props:
 * - certificates: Array of CertificateItem objects
 * - onPreview: function(certificate)
 * - onDownload: function(certificate)
 * - onShare: function(certificate)
 */

export default React.memo(function CertificateGrid({
  certificates = [],
  onPreview,
  onDownload,
  onShare,
  onCopyId
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
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
      {certificates.map((cert) => (
        <motion.div key={cert.id || cert.certificateId} variants={itemVariants} className="h-full">
          <CertificateCard
            certificate={cert}
            onPreview={onPreview}
            onDownload={onDownload}
            onShare={onShare}
            onCopyId={onCopyId}
          />
        </motion.div>
      ))}
    </motion.div>
  )
})
