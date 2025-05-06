import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <div className="inset-0 flex items-center justify-center absolute z-50 w-screen h-screen bg-black/60">
      <Loader2 className="animate-spin"/>
    </div>
  )
}

export default Loading