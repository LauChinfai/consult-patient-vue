interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }
}

type QCType = {
  Login: {
    check(): boolean
    getMe(cb: (openId: string) => void): void
  }
}

declare const QC: QCType

interface ImportMetaEnv {
  VITE_APP_CALLBACK: String
  VITE_APP_TITLE: string
}
