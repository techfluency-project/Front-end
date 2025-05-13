'use client'
import { useParams } from 'next/navigation'
import Activity from '../activity'

export default function SpecificActivityPage() {
  const { activityId } = useParams()
  if (typeof activityId !== 'string') {
    return <div>Error: Invalid activity ID</div>;
  }
  
  return <Activity mode="single" activityId={activityId} />;
}
