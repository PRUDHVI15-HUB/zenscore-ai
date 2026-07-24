import React, { useState, useRef } from 'react'

export default function UploadZone({ onFileSelected }) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateAndSelectFile = (file) => {
    setError(null)
    if (!file) return

    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
    if (!allowedMimeTypes.includes(file.type)) {
      setError('Only PDF, PNG, JPG, or JPEG files are supported.')
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5 MB
    if (file.size > maxSize) {
      setError('File size must be less than 5 MB.')
      return
    }

    setSelectedFile(file)
    if (onFileSelected) {
      onFileSelected(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0])
    }
  }

  const onButtonClick = () => {
    inputRef.current.click()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <div
        className={`relative w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/10'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 hover:border-blue-400 dark:hover:border-blue-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <svg
            className="w-10 h-10 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Drag &amp; drop your transcript here
          </div>
          <div className="text-xs text-slate-550 dark:text-slate-400">
            or click to browse from files (Max 5MB)
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Supports PDF, PNG, JPG, JPEG
          </div>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-500 font-semibold px-2">
          ⚠️ {error}
        </div>
      )}

      {selectedFile && !error && (
        <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <svg
              className="w-5 h-5 text-blue-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-slate-850 dark:text-slate-200 truncate">
                {selectedFile.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedFile(null)
              if (onFileSelected) onFileSelected(null)
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
