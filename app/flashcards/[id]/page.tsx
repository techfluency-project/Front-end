'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { fetchWithAuth } from '@/app/lib/fetch'
import StudyFlashcards from '../study-cards'
import { FlashcardGroup } from '@/app/lib/flashcards'

const FlashcardGroupPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)

  const [group, setGroup] = useState<FlashcardGroup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await fetchWithAuth(`/api/Flashcard/GetFlashcardGroupById?id=${id}`)
        const data = await res.json()
        setGroup(data)
      } catch (error) {
        console.error('Failed to load group', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!group) return <p>Group not found</p>

  return <StudyFlashcards group={group} />
}

export default FlashcardGroupPage