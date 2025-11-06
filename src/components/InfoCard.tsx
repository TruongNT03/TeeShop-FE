import React from 'react'
import { Mail, MapPin, CalendarCheck } from 'lucide-react'

type Props = {
  email?: string
  location?: string
  joinedAt?: string
}

const InfoRow: React.FC<{ label: string; value?: string; icon: React.ReactNode; emptyFallback?: string }> = ({
  label,
  value,
  icon,
  emptyFallback,
}) => {
  const displayValue = value?.trim() ? value : emptyFallback ?? '—'

  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-3 transition hover:border-primary/40 hover:bg-white">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div>
        <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="text-sm font-medium text-slate-800">{displayValue}</dd>
      </div>
    </div>
  )
}

export const InfoCard: React.FC<Props> = ({ email, location, joinedAt }) => {
  const joinedDisplay = joinedAt ? new Date(joinedAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : undefined

  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl bg-white/80 p-5 shadow-lg ring-1 ring-slate-100">
      <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
      <dl className="grid gap-3">
        <InfoRow label="Email" value={email} icon={<Mail className="h-4 w-4" />} emptyFallback="Not provided" />
        <InfoRow
          label="Location"
          value={location}
          icon={<MapPin className="h-4 w-4" />}
          emptyFallback="Add your location"
        />
        <InfoRow label="Joined" value={joinedDisplay} icon={<CalendarCheck className="h-4 w-4" />} />
      </dl>
    </section>
  )
}
