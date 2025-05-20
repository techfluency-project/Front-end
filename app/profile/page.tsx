'use client'

import { useEffect, useState } from "react"
import { LogOut, User, WifiHigh } from "lucide-react"
import Header from "../components/header"
import Badge from "./badge"
import { fetchWithAuth } from "../lib/fetch"

type UserProgress = {
  totalXP: number
  badges: any[] | null
}

const Profile = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const fetchUserProgress = async () => {
    try {
      const res = await fetchWithAuth('/api/UserProgress')
      const data = await res.json()
      console.log('User Progress:', data)

      setUserProgress({
        totalXP: data.totalXP,
        badges: data.badges,
      })

      if (data.badges) {
        console.log("User Badges:", data.badges)
      }
    } catch (error) {
      console.error('Failed to fetch user progress', error)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetchWithAuth('/api/user/sign-off', {
        method: 'POST',
      })

      if (res.ok) {
        console.log('User logged out')
        // Redirect to login or landing page
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

  return (
    <>
      <Header />

      <div className="flex flex-col gap-4 w-[656px] mb-16 mt-32">
        <h1 className="font-bold text-3xl">Profile</h1>

        <div
          style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          className="flex gap-2 bg-blue-700 rounded-sm text-white p-8 shadow-custom"
        >
          <div className="size-16 p-4 border-2 rounded-full">
            <User className="size-full" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-lg font-bold">Alice Pereira</h2>
            <span>@alicecoxinha</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl">Stats</h3>
          <div className="space-y-2 bg-white rounded-sm p-6">
            <div className="rounded-sm text-blue-700 flex items-center justify-center">
              <WifiHigh className="size-20 -rotate-45" />
              <h2 className="text-6xl font-bold">Intermediate</h2>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-amber-300 text-5xl font-bold">
                {userProgress?.totalXP ?? '...'}
              </h3>
              <span className="text-gray-500 text-sm">Total de XP</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl">Badges</h3>
          <div className="bg-white flex flex-col gap-4 p-8 rounded-sm min-h-[100px] justify-center items-center">
            {userProgress?.badges && userProgress.badges.length > 0 ? (
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

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/25 bg-opacity-50 flex justify-center items-center z-50">
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
