'use client'

import { useState } from "react"
import Header from "../components/header"
import { Flashcard, FlashcardGroup } from "../lib/flashcards"
import { fetchWithAuth } from "../lib/fetch"
import { Trash2 } from "lucide-react"

const StudyFlashcards = ({ group }: { group: FlashcardGroup }) => {
  const [isStudying, setIsStudying] = useState(false)
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const [isAddFlashcardOpen, setIsAddFlashcardOpen] = useState(false)
  const [frontQuestion, setFrontQuestion] = useState("")
  const [backAnswer, setBackAnswer] = useState("")

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)

  const startStudying = () => {
    const shuffled = [...group.flashcards].sort(() => Math.random() - 0.5)
    setShuffledCards(shuffled)
    setCurrentIndex(0)
    setShowAnswer(false)
    setIsStudying(true)
  }

  const deleteFlashcard = async (id: string) => {
    try {
      await fetchWithAuth("/api/Flashcard/DeleteFlashcard", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
      location.reload()
    } catch (err) {
      console.error("Failed to delete flashcard", err)
    }
  }


  const addFlashcard = async (
    flashcardGroupId: string,
    frontQuestion: string,
    backAnswer: string
  ) => {
    await fetchWithAuth("/api/Flashcard/AddCardToFlashcardGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flashcardGroupId,
        frontQuestion,
        backAnswer,
      }),
    })
  }

  const handleDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    console.log(`Flashcard ${shuffledCards[currentIndex].id} marked as ${difficulty}`)

    const nextIndex = currentIndex + 1
    if (nextIndex < shuffledCards.length) {
      setCurrentIndex(nextIndex)
      setShowAnswer(false)
    } else {
      // instead of alert, open completion modal
      setIsCompleteModalOpen(true)
    }
  }

  const closeCompletionModal = () => {
    setIsCompleteModalOpen(false)
    setIsStudying(false)
  }

  console.log(group)

  return (
    <>
      <Header />

      <div className="p-8 mt-24 w-[656px]">
        <h1 className="text-3xl font-bold mb-4">{group.name}</h1>

        {!isStudying ? (
          <>
            <ul className="grid grid-cols-2 gap-4 mb-6">
              {group.flashcards.map((fc, i) => (
                <li
                  key={i}
                  className="relative flex justify-between items-center group rounded-sm bg-gradient-to-br from-blue-700 to-indigo-900 w-full text-white p-4"
                >
                  <span className="truncate">{fc.question}</span>

                  <button
                    onClick={() => deleteFlashcard(fc.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setIsAddFlashcardOpen(true)}
                className="mb-4 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
              >
                Add Flashcard
              </button>
              <button
                onClick={startStudying}
                disabled={group.flashcards.length === 0}
                className={`mb-4 px-4 py-2 rounded text-white ${
                  group.flashcards.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                Study Flashcards
              </button>
            </div>
          </>
        ) : (
          <div className="text-center mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Flashcard {currentIndex + 1} of {shuffledCards.length}
            </h2>
            <div
              className="p-6 border rounded-lg cursor-pointer bg-white shadow-md hover:shadow-lg"
              onClick={() => setShowAnswer(true)}
            >
              <p className="text-lg">
                {!showAnswer
                  ? shuffledCards[currentIndex].question
                  : shuffledCards[currentIndex].answer}
              </p>
              {!showAnswer && (
                <p className="text-sm text-gray-500 mt-2">(Click to reveal answer)</p>
              )}
            </div>

            {showAnswer && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => handleDifficulty("easy")}
                >
                  Easy
                </button>
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => handleDifficulty("medium")}
                >
                  Medium
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleDifficulty("hard")}
                >
                  Hard
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Flashcard Modal */}
      {isAddFlashcardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/60">
          <div className="bg-white rounded-2xl shadow-2xl w-1/3 p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Add a Flashcard</h2>
            <p className="mt-4 text-gray-600">Fill in the front and back of your flashcard.</p>

            <input
              type="text"
              value={frontQuestion}
              onChange={(e) => setFrontQuestion(e.target.value)}
              placeholder="Question"
              className="mt-4 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              value={backAnswer}
              onChange={(e) => setBackAnswer(e.target.value)}
              placeholder="Answer"
              className="mt-4 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-6 flex gap-4 justify-center">
              <button
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white"
                onClick={async () => {
                  await addFlashcard(group.id, frontQuestion, backAnswer)
                  setIsAddFlashcardOpen(false)
                  setFrontQuestion("")
                  setBackAnswer("")
                  location.reload()
                }}
              >
                Add Flashcard
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setIsAddFlashcardOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Study Complete Modal */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/60">
          <div className="bg-white rounded-2xl shadow-2xl w-1/3 p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Study Session Complete!</h2>
            <p className="mt-4 text-gray-600">Great job—you’ve reviewed all flashcards.</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white"
                onClick={closeCompletionModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StudyFlashcards
