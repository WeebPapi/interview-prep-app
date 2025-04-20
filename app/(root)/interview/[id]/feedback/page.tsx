"use client"
import FeedbackComponent from "@/components/FeedbackComponent"
import { useSearchParams } from "next/navigation"
import React from "react"

const Page = () => {
  const params = useSearchParams()
  const feedbackId = params.get("id")
  if (!feedbackId) return <div>Loading...</div>
  return (
    <div>
      <FeedbackComponent feedbackId={feedbackId} />
    </div>
  )
}

export default Page
