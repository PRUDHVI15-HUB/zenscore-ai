import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 32,
      background: '#FFFFFF',
      padding: '14px 20px',
      borderRadius: 16,
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)'
    }}>
      <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
        Showing {startItem}–{endItem} of {totalItems} jobs
      </span>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          style={{
            height: 36,
            padding: '0 14px',
            borderRadius: 10,
            border: '1px solid #E2E8F0',
            background: currentPage === 1 ? '#F8FAFC' : '#FFFFFF',
            color: currentPage === 1 ? '#CBD5E1' : '#334155',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: 'none',
              background: currentPage === pageNum ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' : '#F1F5F9',
              color: currentPage === pageNum ? '#FFFFFF' : '#475569',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
              boxShadow: currentPage === pageNum ? '0 2px 8px rgba(124, 58, 237, 0.25)' : 'none'
            }}
          >
            {pageNum}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          style={{
            height: 36,
            padding: '0 14px',
            borderRadius: 10,
            border: '1px solid #E2E8F0',
            background: currentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
            color: currentPage === totalPages ? '#CBD5E1' : '#334155',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
