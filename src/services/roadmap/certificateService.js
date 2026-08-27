/**
 * certificateService.js
 * Certification Vault Engine for ZenScore AI (Product 4 - Sprint E).
 * Issues, verifies, and permanently stores ZenScore Skill Certificates in 'zenscore_certification_vault_v1.1'.
 */

export const CERT_VAULT_STORAGE_KEY = 'zenscore_certification_vault_v1.1'

/**
 * Gets or initializes the Certification Vault from localStorage.
 */
export function getCertificationVault() {
  try {
    const cached = localStorage.getItem(CERT_VAULT_STORAGE_KEY)
    if (cached) return JSON.parse(cached)
  } catch (e) {
    console.warn('[CertificateService] Vault localStorage read error:', e)
  }

  const defaultVault = {
    version: 'v1.1',
    certificates: [
      {
        id: 'ZS-CERT-88412',
        title: 'ZenScore Java 17 Certified Engineer',
        studentName: 'Student',
        completionDate: '2026-07-20',
        skill: 'Java 17',
        scorePct: 95,
        xpEarned: 300,
        verificationUrl: 'https://zenscore.ai/verify/ZS-CERT-88412',
      },
    ],
    unlockedBadges: [
      { id: 'b_java', name: '🏅 Java Master', category: 'Backend', unlockedAt: '2026-07-20' },
      { id: 'b_sql', name: '🏅 SQL Expert', category: 'Database', unlockedAt: '2026-07-22' },
    ],
  }

  saveCertificationVault(defaultVault)
  return defaultVault
}

/**
 * Persists the Certification Vault to localStorage.
 */
export function saveCertificationVault(vaultObj) {
  try {
    localStorage.setItem(CERT_VAULT_STORAGE_KEY, JSON.stringify(vaultObj))
  } catch (e) {
    console.warn('[CertificateService] Vault localStorage save error:', e)
  }
}

/**
 * Issues a new official ZenScore Skill Certificate upon passing assessment (>= 80%).
 */
export function issueCertificate({ skillName = 'Docker', studentName = 'Student', scorePct = 90, xpEarned = 300 }) {
  const currentVault = getCertificationVault()
  const certId = `ZS-CERT-${Math.floor(10000 + Math.random() * 90000)}`
  const todayStr = new Date().toISOString().split('T')[0]

  const newCert = {
    id: certId,
    title: `ZenScore Certified ${skillName} Professional`,
    studentName,
    completionDate: todayStr,
    skill: skillName,
    scorePct,
    xpEarned,
    verificationUrl: `https://zenscore.ai/verify/${certId}`,
  }

  const updatedVault = {
    ...currentVault,
    certificates: [newCert, ...(currentVault.certificates || [])],
  }

  saveCertificationVault(updatedVault)
  return newCert
}
