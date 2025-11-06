import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Heart, ShoppingBag, Star, TrendingUp, Zap } from 'lucide-react'
import { ProfileHeader } from '@/components/ProfileHeader'
import { InfoCard } from '@/components/InfoCard'
import { EditProfileModal } from '@/components/EditProfileModal'
import { useProfile } from '@/hooks/useProfile'
import type { UpdateProfileDto } from '@/api'

const ProfilePage: React.FC = () => {
  const { profile, isLoading, isError, error, refetch, updateProfile, isUpdating, uploadAvatar } = useProfile()
  const [editOpen, setEditOpen] = useState(false)
  const [bio, setBio] = useState<string>('')
  const [location, setLocation] = useState<string>('')

  // Move all hooks BEFORE any early returns
  const user = profile

  const fullName = useMemo(() => {
    if (!user) return ''
    const composed = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    return composed.length > 0 ? composed : user.email
  }, [user?.email, user?.firstName, user?.lastName, user])

  const fallbackBio = useMemo(() => {
    if (!user) return ''
    if (!user.firstName && !user.lastName) return 'Fashion enthusiast exploring fresh trends.'
    const first = user.firstName?.trim()
    return first
      ? `Hi, I'm ${first}. I love discovering new collections and sharing feedback.`
      : 'Fashion enthusiast exploring fresh trends.'
  }, [user?.firstName, user?.lastName, user])

  const fallbackLocation = 'Ho Chi Minh City, Vietnam'

  useEffect(() => {
    setBio(fallbackBio)
  }, [fallbackBio])

  useEffect(() => {
    setLocation(fallbackLocation)
  }, [])

  const handleOpenEdit = () => {
    setEditOpen(true)
  }

  // Now safe to have early returns after all hooks
  if (isLoading) {
    return (
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-lg p-6 animate-pulse h-28" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-lg p-6 animate-pulse h-40" />
            <div className="bg-white rounded-lg p-6 animate-pulse h-40" />
          </div>
        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium text-slate-800">Error</h2>
            <p className="mt-2 text-sm text-red-600">{(error as any)?.message ?? 'Failed to fetch profile'}</p>
            <div className="mt-4">
              <button onClick={() => refetch()} className="px-4 py-2 rounded-md border">
                Retry
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <h2 className="text-lg font-medium">No profile found</h2>
            <p className="mt-2 text-sm text-slate-600">Create your profile to get started.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-slate-50/60 p-6">
      <div className="mx-auto mt-10 max-w-5xl space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Edit profile
          </button>
        </div>

        <ProfileHeader avatarUrl={user.avatar} name={fullName} bio={bio} email={user.email} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="flex h-full flex-col gap-6 rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-slate-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">About</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {bio?.trim() ? bio : "You haven't written a bio yet. Share something about yourself!"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Interests</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Fashion', 'Trending', 'New Arrivals', 'Sales'].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition cursor-pointer"
                    >
                      <Zap className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="h-full"
          >
            <InfoCard email={user.email} location={location} joinedAt={user.createdAt} />
          </motion.div>
        </div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <div className="rounded-2xl bg-linear-to-br from-blue-50 to-blue-100/50 p-6 ring-1 ring-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-600">Total Orders</p>
                <p className="mt-2 text-3xl font-bold text-blue-900">12</p>
              </div>
              <ShoppingBag className="h-12 w-12 text-blue-300" />
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-rose-50 to-rose-100/50 p-6 ring-1 ring-rose-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-rose-600">Wishlist</p>
                <p className="mt-2 text-3xl font-bold text-rose-900">8</p>
              </div>
              <Heart className="h-12 w-12 text-rose-300" />
            </div>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-amber-50 to-amber-100/50 p-6 ring-1 ring-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-600">Rating</p>
                <p className="mt-2 flex items-center gap-1">
                  <span className="text-3xl font-bold text-amber-900">4.8</span>
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-amber-300" />
            </div>
          </div>
        </motion.div>

        {/* Recent Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-slate-100"
        >
          <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
          <div className="mt-4 space-y-3">
            {[
              {
                id: '#ORD001',
                date: 'Nov 5, 2025',
                items: 3,
                status: 'Delivered',
                statusColor: 'bg-emerald-100 text-emerald-700',
              },
              {
                id: '#ORD002',
                date: 'Oct 28, 2025',
                items: 2,
                status: 'In Transit',
                statusColor: 'bg-blue-100 text-blue-700',
              },
              {
                id: '#ORD003',
                date: 'Oct 15, 2025',
                items: 1,
                status: 'Delivered',
                statusColor: 'bg-emerald-100 text-emerald-700',
              },
            ].map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition hover:border-primary/40 hover:bg-slate-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{order.id}</p>
                  <p className="text-xs text-slate-500">
                    {order.items} items • {order.date}
                  </p>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={{
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          bio,
          email: user?.email,
          location,
          avatar: user?.avatar,
        }}
        onAvatarUpload={uploadAvatar}
        onSave={async (payload) => {
          const dto: UpdateProfileDto = {
            firstName: payload.firstName ?? user?.firstName ?? '',
            lastName: payload.lastName ?? user?.lastName ?? '',
            avatar: payload.avatar ?? user?.avatar ?? '',
          }

          try {
            await updateProfile(dto)
            setBio(payload.bio ?? bio)
            setLocation(payload.location ?? location)
          } catch (err) {
            console.error('Update failed', err)
            throw err
          }
        }}
        isSaving={isUpdating}
      />
    </main>
  )
}

export default ProfilePage
