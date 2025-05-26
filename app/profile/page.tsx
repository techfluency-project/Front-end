'use client'

import { useEffect, useState } from "react"
import { LogOut, User, Wifi, WifiLow, WifiHigh, Settings } from "lucide-react"
import Header from "../components/header"
import Badge from "./badge"
import { fetchWithAuth } from "../lib/fetch"
import { UserProgress } from "../lib/user-progress"

const Profile = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isAnyModalOpen = showEditModal || showLogoutModal

  const fetchUserProgress = async () => {
    try {
      const res = await fetchWithAuth('/api/UserProgress')
      const data = await res.json()
      setUserProgress(data)
    } catch (error) {
      console.error('Failed to fetch user progress', error)
    }
  }

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const res = await fetchWithAuth('/api/User/my-profile')
      const data = await res.json()
      setUserData(data)
    } catch (error) {
      console.error('Failed to fetch user data', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserProfile = async () => {
    setIsLoading(true)
    try {
      const res = await fetchWithAuth('/api/User/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      if (res.ok) {
        setIsEditing(false)
        setShowEditModal(false)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetchWithAuth('/api/user/sign-off', { method: 'POST' })
      if (res.ok) {
        window.location.href = '/signin'
      } else {
        console.error('Failed to log out')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    fetchUserProgress()
  }, [])

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0: return 'Beginner'
      case 1: return 'Intermediate'
      case 2: return 'Advanced'
      default: return 'Unknown'
    }
  }

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 0: return <WifiLow className="size-20 text-blue-700 -rotate-45" />
      case 1: return <WifiHigh className="size-20 text-blue-700 -rotate-45" />
      case 2: return <Wifi className="size-20 text-blue-700 -rotate-45" />
      default: return <WifiLow className="size-20 text-blue-700 -rotate-45" />
    }
  }

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    
    // Cleanup to ensure the class is removed if component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isAnyModalOpen])

  return (
    <>
      <Header />

      <div className="flex flex-col gap-4 w-[656px] mb-16 mt-32">
        <h1 className="font-bold text-3xl">Profile</h1>

        <div
          style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          className="flex gap-8 bg-blue-700 rounded-sm text-white p-8 shadow-custom"
        >
          <div className="rounded-full border border-white p-6">
            <User className="text-white size-10" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-lg font-bold">{userProgress?.username}</h2>
            <span>@{userProgress?.username}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl">Stats</h3>
          <div className="space-y-2 bg-white rounded-sm p-6">
            <div className="flex items-center justify-center gap-2">
              {userProgress && getLevelIcon(userProgress.level)}
              <h3 className="text-blue-700 text-3xl font-bold">
                {userProgress ? getLevelLabel(userProgress.level) : 'Loading...'}
              </h3>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-amber-300 text-5xl font-bold">
                {userProgress?.totalXP ?? '...'}
              </h3>
              <span className="text-gray-500 text-sm">Total XP</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl">Badges</h3>
          <div className="bg-white flex flex-col gap-4 p-8 rounded-sm min-h-[100px] justify-center items-center">
            {userProgress?.badges?.length ? (
              userProgress.badges.map((badge, index) => (
                <Badge key={index} id={badge.id} progress={badge.progress} />
              ))
            ) : (
              <p className="text-gray-500 italic">Looks like you don't have any badges yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl">Configuration</h3>
          <div className="space-y-4 bg-white p-8">
            <button onClick={() => { setShowEditModal(true); fetchUserData() }} className="w-full text-left">
              <div className="flex gap-4">
                <div className="rounded-full bg-gray-100 p-6">
                  <Settings className="text-blue-700 size-10" />
                </div>
                <div className="flex flex-col w-full justify-around">
                  <h4 className="text-xl font-bold">Edit Profile</h4>
                </div>
              </div>
            </button>

            <button onClick={() => setShowLogoutModal(true)} className="w-full text-left">
              <div className="flex gap-4">
                <div className="rounded-full bg-gray-100 p-6">
                  <LogOut className="text-red-700 size-10" />
                </div>
                <div className="flex flex-col w-full justify-around">
                  <h4 className="text-xl font-bold">Log out</h4>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
          <div className="mt-4 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && userData && (
        <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-md space-y-4 max-w-sm w-full">
            <h2 className="text-xl font-semibold">Edit Profile</h2>

            {['username', 'email', 'name', 'phone'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 capitalize">{field}</label>
                <input
                  className="w-full bg-gray-100 p-2 rounded"
                  type="text"
                  value={userData[field]}
                  disabled={!isEditing}
                  onChange={(e) => setUserData({ ...userData, [field]: e.target.value })}
                />
              </div>
            ))}

            <div className="flex justify-end gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateUserProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </>
              )}
              <button
                onClick={() => { setShowEditModal(false); setIsEditing(false) }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-md space-y-4 max-w-sm">
            <h2 className="text-xl font-semibold">Log out</h2>
            <p className="text-gray-700">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
