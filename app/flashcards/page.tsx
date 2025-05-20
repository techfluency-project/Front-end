'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '../lib/fetch'
import { Plus } from 'lucide-react'
import { FlashcardGroup } from '../lib/flashcards'
import Header from '../components/header'

const Flashcards = () => {
  const [groups, setGroups] = useState<FlashcardGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateFlashCardGroupOpen, setIsCreateFlashCardGroupOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const router = useRouter()

  const fetchFlashcardGroups = async () => {
    setLoading(true)
    try {
      const res = await fetchWithAuth('/api/Flashcard/GetAllFlashcardsGroup')

      if (!res.ok) {
        const errText = await res.text()
        console.error('API error fetching groups:', res.status, errText)

        // Redirect to signin on auth errors or "user not found"
        if (res.status === 401 || (res.status === 400 && errText.toLowerCase().includes('user not found'))) {
          router.push('/signin')
        }
        return
      }

      const data = await res.json()
      console.log('Fetched flashcard groups:', data)
      setGroups(data)
    } catch (err) {
      console.error('Error fetching flashcard groups:', err)
    } finally {
      setLoading(false)
    }
  }

  const createFlashcardGroup = async (name: string) => {
    try {
      const response = await fetchWithAuth('/api/Flashcard/CreateFlashcardGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error('Failed to create flashcard group')
      }

      const result = await response.json()
      console.log('Flashcard group created:', result)
      await fetchFlashcardGroups()
    } catch (error) {
      console.error('Error creating flashcard group:', error)
    }
  }

  useEffect(() => {
    fetchFlashcardGroups()
  }, [])

  return (
    <>
      <Header />

      <div className="flex flex-col gap-4 w-[656px] mb-16 mt-24">
        <h1 className="font-bold text-3xl">Flashcards</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {groups.map(group => (
              <div
                key={group.id}
                onClick={() => router.push(`/flashcards/${group.id}`)}
                className="cursor-pointer rounded-sm bg-gradient-to-br from-blue-700 to-indigo-900 w-full text-white p-4 hover:opacity-80 transition"
              >
                <h2 className="text-xl font-bold truncate">{group.name}</h2>
                <span className="truncate">{group.flashcards.length} cards</span>
              </div>
            ))}
            <button
              className="col-span-2 flex items-center justify-center h-[84px]"
              onClick={() => setIsCreateFlashCardGroupOpen(true)}
            >
              <Plus className="size-20 text-blue-700 border-4 border-blue-700 rounded-full" />
            </button>
          </div>
        )}
      </div>

      {isCreateFlashCardGroupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/60">
          <div className="bg-white rounded-2xl shadow-2xl w-1/3 p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Create a Flashcard Group</h2>
            <p className="mt-4 text-gray-600">Enter a name for your new flashcard group.</p>

            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="mt-4 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-6 flex gap-4 justify-center">
              <button
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white"
                onClick={async () => {
                  await createFlashcardGroup(groupName)
                  setIsCreateFlashCardGroupOpen(false)
                  setGroupName("")
                }}
              >
                Create Group
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setIsCreateFlashCardGroupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Flashcards
