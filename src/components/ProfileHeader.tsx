import React from 'react'
import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'

type Props = {
  avatarUrl?: string | null
  name?: string
  bio?: string
  email?: string
}

export const ProfileHeader: React.FC<Props> = ({ avatarUrl, name, bio, email }) => {
  const displayName = name?.trim() || 'Welcome back'
  const description = bio?.trim() || 'Set up your profile to let others know more about you.'
  const fallbackAvatar = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(displayName || 'profile')}`
  const avatarSrc = avatarUrl && avatarUrl.trim().length > 0 ? avatarUrl : fallbackAvatar

  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-linear-to-r from-sky-100 via-white to-violet-100 p-px shadow-lg"
    >
      <div className="relative flex flex-col gap-6 rounded-[1.1rem] bg-white/70 p-6 backdrop-blur">
        <div
          className="absolute inset-y-0 right-0 hidden h-full w-1/3 bg-linear-to-l from-violet-100/60 to-transparent md:block"
          aria-hidden
        />
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <img
                src={avatarSrc}
                alt={displayName ? `${displayName} avatar` : 'User avatar'}
                className="h-full w-full rounded-full object-cover shadow-inner ring-4 ring-white"
              />
              <span className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white shadow-md">
                •
              </span>
            </div>
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary">Active Member</Badge>
              <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{displayName}</h1>
              {email ? <p className="text-sm text-slate-500">{email}</p> : null}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 md:max-w-xl">{description}</p>
        </div>
      </div>
    </motion.header>
  )
}
