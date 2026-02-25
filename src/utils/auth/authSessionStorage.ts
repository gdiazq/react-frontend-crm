const storageKeys = {
  pendingVerifyEmail: 'pendingVerifyEmail',
  pendingVerifyPhone: 'pendingVerifyPhone',
  pendingPasswordToken: 'pendingPasswordToken',
  pendingPasswordTokenIssuedAt: 'pendingPasswordTokenIssuedAt',
  pendingRecoveryEmail: 'pendingRecoveryEmail',
}

const getSessionStorage = () => {
  if (typeof window === 'undefined') return null
  return window.sessionStorage
}

export const createAuthSessionStorage = () => {
  const setPendingVerifyEmail = (email: string) => {
    getSessionStorage()?.setItem(storageKeys.pendingVerifyEmail, email)
  }

  const getPendingVerifyEmail = () => {
    return getSessionStorage()?.getItem(storageKeys.pendingVerifyEmail) || null
  }

  const clearPendingVerifyEmail = () => {
    getSessionStorage()?.removeItem(storageKeys.pendingVerifyEmail)
  }

  const setPendingVerifyPhone = (phone: string) => {
    getSessionStorage()?.setItem(storageKeys.pendingVerifyPhone, phone)
  }

  const getPendingVerifyPhone = () => {
    return getSessionStorage()?.getItem(storageKeys.pendingVerifyPhone) || null
  }

  const clearPendingVerifyPhone = () => {
    getSessionStorage()?.removeItem(storageKeys.pendingVerifyPhone)
  }

  const setPendingPasswordToken = (token: string) => {
    const storage = getSessionStorage()
    storage?.setItem(storageKeys.pendingPasswordToken, token)
    storage?.setItem(storageKeys.pendingPasswordTokenIssuedAt, String(Date.now()))
  }

  const getPendingPasswordToken = () => {
    return getSessionStorage()?.getItem(storageKeys.pendingPasswordToken) || null
  }

  const getPendingPasswordTokenIssuedAt = () => {
    const value = getSessionStorage()?.getItem(storageKeys.pendingPasswordTokenIssuedAt)
    if (!value) return null
    const issuedAt = Number.parseInt(value, 10)
    if (!Number.isFinite(issuedAt)) return null
    return issuedAt
  }

  const clearPendingPasswordToken = () => {
    const storage = getSessionStorage()
    storage?.removeItem(storageKeys.pendingPasswordToken)
    storage?.removeItem(storageKeys.pendingPasswordTokenIssuedAt)
  }

  const setPendingRecoveryEmail = (email: string) => {
    getSessionStorage()?.setItem(storageKeys.pendingRecoveryEmail, email)
  }

  const getPendingRecoveryEmail = () => {
    return getSessionStorage()?.getItem(storageKeys.pendingRecoveryEmail) || null
  }

  const clearPendingRecoveryEmail = () => {
    getSessionStorage()?.removeItem(storageKeys.pendingRecoveryEmail)
  }

  return {
    setPendingVerifyEmail,
    getPendingVerifyEmail,
    clearPendingVerifyEmail,
    setPendingVerifyPhone,
    getPendingVerifyPhone,
    clearPendingVerifyPhone,
    setPendingPasswordToken,
    getPendingPasswordToken,
    getPendingPasswordTokenIssuedAt,
    clearPendingPasswordToken,
    setPendingRecoveryEmail,
    getPendingRecoveryEmail,
    clearPendingRecoveryEmail,
  }
}

