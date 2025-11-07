import React, { useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  initial?: {
    firstName?: string
    lastName?: string
    bio?: string
    email?: string
    location?: string
    avatar?: string
  }
  onSave: (payload: {
    firstName?: string
    lastName?: string
    bio?: string
    email?: string
    location?: string
    avatar?: string
  }) => Promise<void>
  onAvatarUpload?: (file: File) => Promise<string>
  isSaving?: boolean
}

export const EditProfileModal: React.FC<Props> = ({ open, onClose, initial, onSave, onAvatarUpload, isSaving }) => {
  // Track if modal was previously open to detect open state change
  const [wasOpen, setWasOpen] = React.useState(false)

  const [firstName, setFirstName] = useState(() => initial?.firstName ?? '')
  const [lastName, setLastName] = useState(() => initial?.lastName ?? '')
  const [bio, setBio] = useState(() => initial?.bio ?? '')
  const [email, setEmail] = useState(() => initial?.email ?? '')
  const [location, setLocation] = useState(() => initial?.location ?? '')
  const [avatar, setAvatar] = useState(() => initial?.avatar ?? '')
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(() => initial?.avatar ?? '')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  // Only reset fields when modal OPENS (transition from closed to open)
  React.useEffect(() => {
    if (open && !wasOpen) {
      // Modal just opened - reset to initial values
      setFirstName(initial?.firstName ?? '')
      setLastName(initial?.lastName ?? '')
      setBio(initial?.bio ?? '')
      setEmail(initial?.email ?? '')
      setLocation(initial?.location ?? '')
      setAvatar(initial?.avatar ?? '')
      setAvatarPreview(initial?.avatar ?? '')
      setNewAvatarUrl(null)
      setAvatarError('')
      setWasOpen(true)
    } else if (!open && wasOpen) {
      // Modal just closed
      setWasOpen(false)
    }
  }, [open])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image size must be less than 5MB')
      return
    }

    setAvatarError('')

    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploadingAvatar(true)

    try {
      if (onAvatarUpload) {
        const uploadedUrl = await onAvatarUpload(file)
        console.log('Avatar URL received:', uploadedUrl)
        setNewAvatarUrl(uploadedUrl)
        setAvatar(uploadedUrl)
        setAvatarError('')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed'
      setAvatarError(errorMsg)
      console.error('Avatar upload error:', err)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const clearAvatar = () => {
    setAvatar('')
    setNewAvatarUrl(null)
    setAvatarPreview('')
    setAvatarError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalAvatar = newAvatarUrl ?? avatar
    const payload = { firstName, lastName, bio, email, location, avatar: finalAvatar }

    try {
      await onSave(payload)
      onClose()
    } catch (err) {
      console.error('Save profile failed', err)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl transform rounded-2xl bg-white/95 p-6 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200 transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        <h3 id="edit-profile-title" className="text-lg font-semibold text-slate-900">
          Edit profile
        </h3>

        <div className="mt-4 grid gap-4">
          {/* Avatar Upload Section */}
          <div className="text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Avatar</span>
            <div className="mt-2 flex gap-4 items-start">
              {/* Avatar Preview */}
              <div className="relative h-24 w-24 shrink-0 rounded-full bg-slate-100 overflow-hidden ring-2 ring-slate-200 shadow-sm">
                {avatarPreview ? (
                  <>
                    <img src={avatarPreview} alt="avatar preview" className="h-full w-full object-cover" />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                        <div className="flex items-center justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      </div>
                    )}
                    {!isUploadingAvatar && avatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={clearAvatar}
                          className="rounded-full bg-white p-1 text-slate-900 hover:bg-slate-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    <Upload className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Upload Input */}
              <div className="flex-1">
                <label className="block relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isUploadingAvatar || isSaving}
                    className="hidden"
                  />
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center cursor-pointer hover:border-primary/40 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <p className="text-sm font-medium text-slate-600">
                      {isUploadingAvatar ? '⏳ Uploading...' : '📤 Click to upload'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF (max 5MB)</p>
                  </div>
                </label>
                {avatarError && (
                  <p className="mt-2 text-xs text-red-600 bg-red-50 rounded px-2 py-1 border border-red-200">
                    ❌ {avatarError}
                  </p>
                )}
                {avatar && !avatarError && (
                  <p className="mt-2 text-xs text-emerald-600 bg-emerald-50 rounded px-2 py-1 border border-emerald-200">
                    ✓ Upload thành công
                  </p>
                )}
              </div>
            </div>
          </div>

          <label className="text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">First name</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Alexa"
            />
          </label>

          <label className="text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Last name</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Rawles"
            />
          </label>

          <label className="text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Bio</span>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share a short introduction about yourself"
            />
          </label>

          <label className="text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</span>
            <input
              type="email"
              className="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
            />
            <span className="mt-1 block text-xs text-slate-400">Contact support to update your email.</span>
          </label>

          <label className="text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Location</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || isUploadingAvatar}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
