import React from 'react'

export default function SubjectPreviewTable({
  subjects = [],
  repairedFields = [],
  warnings = [],
  onSubjectChange
}) {
  const isRepaired = (subId, fieldName) => {
    return repairedFields.some(f => f.subjectId === subId && f.field === fieldName)
  }

  const getCellStatus = (subId, fieldName) => {
    const hasError = warnings.some(w => {
      if (w.subjectId !== subId) return false
      const t = String(w.type).toLowerCase()
      if (fieldName === 'credits' && t === 'credits') return true
      if (fieldName === 'finalGrade' && t === 'grade') return true
      if (fieldName === 'name' && t === 'name') return true
      return false
    })

    if (hasError) return 'error'
    if (isRepaired(subId, fieldName)) return 'repaired'
    return 'normal'
  }

  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full min-w-[650px] border-collapse text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-4 py-3 min-w-[220px]">Subject</th>
            <th className="px-4 py-3 w-24 text-center">Credits</th>
            <th className="px-4 py-3 w-24 text-center">Grade</th>
            <th className="px-4 py-3 w-28 text-center">Grade Point</th>
            <th className="px-4 py-3 w-28 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {subjects.map((sub, idx) => {
            const isDuplicate = sub.duplicate === true
            const isPassed = sub.finalGrade !== null && sub.finalGrade >= 4

            return (
              <tr
                key={sub.id || idx}
                className={`transition-all ${
                  isDuplicate
                    ? 'bg-amber-50/30 dark:bg-amber-950/10'
                    : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Subject Name */}
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={sub.name || ''}
                    onChange={(e) => onSubjectChange?.(sub.id, 'name', e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border outline-none font-semibold text-slate-900 dark:text-slate-100 bg-transparent transition-all ${
                      getCellStatus(sub.id, 'name') === 'error'
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-700 dark:text-rose-400'
                        : getCellStatus(sub.id, 'name') === 'repaired'
                        ? 'border-indigo-400 focus:border-indigo-500 bg-indigo-50/10 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950'
                    }`}
                  />
                </td>

                {/* Credits */}
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    value={sub.credits === null || sub.credits === undefined ? '' : sub.credits}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : parseInt(e.target.value, 10)
                      onSubjectChange?.(sub.id, 'credits', val)
                    }}
                    className={`w-full max-w-16 mx-auto px-2 py-1.5 text-center rounded-lg border outline-none font-bold text-slate-900 dark:text-slate-100 bg-transparent transition-all ${
                      getCellStatus(sub.id, 'credits') === 'error'
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-700 dark:text-rose-400'
                        : getCellStatus(sub.id, 'credits') === 'repaired'
                        ? 'border-indigo-400 focus:border-indigo-500 bg-indigo-50/10 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950'
                    }`}
                  />
                </td>

                {/* Raw Grade */}
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={sub.rawGrade || ''}
                    onChange={(e) => onSubjectChange?.(sub.id, 'rawGrade', e.target.value)}
                    className={`w-full max-w-16 mx-auto px-2 py-1.5 text-center rounded-lg border outline-none font-bold text-slate-900 dark:text-slate-100 bg-transparent transition-all ${
                      getCellStatus(sub.id, 'rawGrade') === 'error'
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-700 dark:text-rose-400'
                        : getCellStatus(sub.id, 'rawGrade') === 'repaired'
                        ? 'border-indigo-400 focus:border-indigo-500 bg-indigo-50/10 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-955'
                    }`}
                  />
                </td>

                {/* Final Grade Point */}
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    step="0.01"
                    value={sub.finalGrade === null || sub.finalGrade === undefined ? '' : sub.finalGrade}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : parseFloat(e.target.value)
                      onSubjectChange?.(sub.id, 'finalGrade', val)
                    }}
                    className={`w-full max-w-16 mx-auto px-2 py-1.5 text-center rounded-lg border outline-none font-bold text-slate-900 dark:text-slate-100 bg-transparent transition-all ${
                      getCellStatus(sub.id, 'finalGrade') === 'error'
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-700 dark:text-rose-400'
                        : getCellStatus(sub.id, 'finalGrade') === 'repaired'
                        ? 'border-indigo-400 focus:border-indigo-500 bg-indigo-50/10 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-955'
                    }`}
                  />
                </td>

                {/* Status Column */}
                <td className="px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {sub.result === 'PASS' || isPassed ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        PASS
                      </span>
                    ) : sub.result === 'FAIL' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        FAIL
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
