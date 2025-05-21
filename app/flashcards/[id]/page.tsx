'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { fetchWithAuth } from '@/app/lib/fetch'
import StudyFlashcards from '../study-cards'
import { FlashcardGroup } from '@/app/lib/flashcards'

const FlashcardGroupPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)
  const router = useRouter()

  const [group, setGroup] = useState<FlashcardGroup | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetchWithAuth(`/api/Flashcard/GetFlashcardGroupById?id=${id}`)
        if (!res.ok) {
          setNotFound(true)
          return
        }
        const data = await res.json()
        setGroup(data)
      } catch (error) {
        console.error('Failed to load group', error)
        setNotFound(true)
      }
    }

    fetchGroup()
  }, [id])

  if (!group) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound && !group) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded shadow-md space-y-4 max-w-sm text-center">
          <h2 className="text-xl font-semibold text-red-600">Flashcard Group Not Found</h2>
          <p className="text-gray-700">The flashcard group you are trying to access does not exist or could not be loaded.</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <StudyFlashcards group={group} />
}

export default FlashcardGroupPage
