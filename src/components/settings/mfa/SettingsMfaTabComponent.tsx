import { ButtonComponent, InputComponent } from '@/components'
import type { SettingDeviceSession, SettingMfaSetupData, SettingMfaState } from '@/types'
import {
  SettingsCardComponent,
  SettingsDeviceIcon,
  SettingsSectionTitleComponent,
  SettingsShieldIcon,
} from '../shared'

interface SettingsMfaTabComponentProps {
  mfaState: SettingMfaState
  mfaSetupData: SettingMfaSetupData
  mfaSetupSteps: string[]
  mfaQrImage: string
  mfaStatusLabel: string
  mfaStatusClass: string
  mfaVerificationCode: string
  devices: SettingDeviceSession[]
  currentUsername: string
  loadingMfaAction: boolean
  loadingLogoutDevice: boolean
  loadingSessions: boolean
  onEnableMfa: () => void
  onDisableMfa: (username: string) => void
  onVerifyMfa: (username: string) => void
  onMfaVerificationCodeChange: (value: string) => void
  onLogoutDevice: (id: string) => void
}

interface InfoTileProps {
  label: string
  value: string
  valueClass?: string
}

export function SettingsMfaTabComponent(props: SettingsMfaTabComponentProps) {
  const {
    mfaState,
    mfaSetupData,
    mfaSetupSteps,
    mfaQrImage,
    mfaStatusLabel,
    mfaStatusClass,
    mfaVerificationCode,
    devices,
    currentUsername,
    loadingMfaAction,
    loadingLogoutDevice,
    loadingSessions,
    onEnableMfa,
    onDisableMfa,
    onVerifyMfa,
    onMfaVerificationCodeChange,
    onLogoutDevice,
  } = props

  return (
    <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-5">
        <SettingsCardComponent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-white/10 sm:flex-row sm:items-start sm:justify-between">
            <SettingsSectionTitleComponent eyebrow="MFA" title="Autenticacion multifactor" description="Protege la cuenta con codigos temporales desde una app autenticadora." />
            <div className="r-xl inline-flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
              <SettingsShieldIcon />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <InfoTile label="Estado" value={mfaStatusLabel} valueClass={mfaStatusClass} />
            <InfoTile label="Metodo" value={mfaState.method} />
            <InfoTile label="Verificado" value={mfaState.verified ? 'Si' : 'No'} />
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Ultima verificacion: {mfaState.lastVerification}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {!mfaState.enabled && (
              <ButtonComponent variant="primary" disabled={loadingMfaAction} label={loadingMfaAction ? 'Procesando...' : 'Activar MFA'} onClick={onEnableMfa} />
            )}
            {mfaState.enabled && (
              <ButtonComponent variant="danger" disabled={loadingMfaAction} label="Desactivar MFA" onClick={() => onDisableMfa(currentUsername)} />
            )}
          </div>

          {!mfaState.enabled && (
            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <InputComponent value={mfaVerificationCode} label="Codigo de verificacion" type="text" placeholder="000000" onValueChange={onMfaVerificationCodeChange} />
              <ButtonComponent variant="outline" disabled={loadingMfaAction} label="Verificar codigo" onClick={() => onVerifyMfa(currentUsername)} />
            </div>
          )}
        </SettingsCardComponent>

        <SettingsCardComponent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <SettingsSectionTitleComponent eyebrow="Sesiones" title="Dispositivos activos" description="Revisa desde donde se mantiene abierta tu cuenta." />
            <div className="r-xl inline-flex h-11 w-11 shrink-0 items-center justify-center bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
              <SettingsDeviceIcon />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {devices.map((device) => (
              <article key={device.id} className="r-xl flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-slate-50/70 px-3.5 py-3 dark:border-white/10 dark:bg-slate-900/55">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">{device.name}</p>
                    {device.current && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Actual</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{device.location} · {device.lastSeen}</p>
                </div>
                <ButtonComponent
                  variant={device.current ? 'outline' : 'danger'}
                  disabled={loadingLogoutDevice || loadingSessions}
                  label={device.current ? 'Sesion actual' : 'Cerrar sesion'}
                  onClick={() => onLogoutDevice(device.id)}
                />
              </article>
            ))}
          </div>
        </SettingsCardComponent>
      </div>

      <SettingsCardComponent className="overflow-hidden">
        <div className="relative isolate p-5 sm:p-6">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_0%,rgba(8,145,178,0.14),transparent_36%)] dark:bg-[radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.11),transparent_36%)]" />
          <SettingsSectionTitleComponent eyebrow="Setup" title="Configurar MFA" description="Escanea el codigo QR o usa el secret manual para vincular tu app." />

          <ol className="mt-5 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
            {mfaSetupSteps.map((step, index) => (
              <li key={step} className="r-xl border border-slate-200 bg-white/75 px-3.5 py-3 dark:border-white/10 dark:bg-slate-900/60">
                <span className="num mr-2 text-[11px] text-cyan-700 dark:text-cyan-300">{String(index + 1).padStart(2, '0')}</span>
                {step.replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ol>

          <div className="mt-5">
            {mfaQrImage ? (
              <div className="r-2xl border border-cyan-200 bg-cyan-50/70 p-4 dark:border-cyan-300/25 dark:bg-cyan-300/10">
                <img src={mfaQrImage} alt="QR de configuracion MFA" className="mx-auto h-48 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-slate-900" />
              </div>
            ) : (
              <div className="r-2xl flex min-h-48 items-center justify-center border border-dashed border-slate-300 bg-white/55 px-4 text-center text-sm text-slate-500 dark:border-white/15 dark:bg-slate-900/40 dark:text-slate-400">
                Activa MFA para ver el codigo QR.
              </div>
            )}
          </div>

          {mfaSetupData.secret && (
            <div className="mt-4">
              <p className="num mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Secret manual</p>
              <code className="block break-all rounded-md bg-slate-950 px-3 py-2 text-xs text-cyan-300 dark:bg-black/40">{mfaSetupData.secret}</code>
            </div>
          )}
        </div>
      </SettingsCardComponent>
    </section>
  )
}

function InfoTile({ label, value, valueClass = '' }: InfoTileProps) {
  return (
    <article className="r-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-slate-900/55">
      <p className="num text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label}</p>
      <p className={`mt-2 truncate text-sm font-semibold text-slate-800 dark:text-slate-100 ${valueClass}`}>{value}</p>
    </article>
  )
}
