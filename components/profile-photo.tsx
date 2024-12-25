"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { X } from "lucide-react"
import Image from 'next/image'
import type { PostgrestError } from '@supabase/supabase-js'

export function ProfilePhoto() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchProfilePhoto = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('photo_url')
        .eq('id', user?.id)
        .single()

      if (data?.photo_url) {
        setPhotoUrl(data.photo_url)
      }
    } catch (err) {
      console.error('Error fetching photo:', err)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      fetchProfilePhoto()
    }
  }, [user?.id, fetchProfilePhoto])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) {
      console.log('No file or user:', { file: !!file, userId: user?.id })
      return
    }

    setLoading(true)
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          updated_at: new Date().toISOString(),
        })

      if (profileError) {
        throw profileError
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          photo_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      setPhotoUrl(publicUrl)
      alert('Photo uploaded successfully!')
    } catch (error: unknown) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload photo. Please try again.')
    } finally {
      setLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {photoUrl ? (
          <div className="relative w-8 h-8">
            <Image 
              src={photoUrl} 
              alt="Profile" 
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Profile Photo</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                {photoUrl ? (
                  <Image 
                    src={photoUrl} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? 'Uploading...' : photoUrl ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 