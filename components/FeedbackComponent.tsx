"use client"
import {
  getFeedbackById,
  getInterviewById,
} from "@/lib/actions/general.actions"
import dayjs from "dayjs"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const FeedbackComponent = ({ feedbackId }: { feedbackId: string }) => {
  if (!feedbackId) return <div>Loading...</div>
  const router = useRouter()
  const [feedback, setFeedback] = useState<null | Feedback>(null)
  const [interview, setInterview] = useState<null | Interview>()
  const [recommended, setRecommended] = useState<boolean>(
    feedback?.totalScore! > 50
  )
  const formattedDate = dayjs(feedback?.createdAt).format(
    "MMM D, YYYY - HH:mm "
  )
  const formatTitle = (level: string, role: string) => {
    if (level && role) {
      let formattedRole = role.replace(/frontend/gi, "Front-End")
      formattedRole = formattedRole.replace(/backend/gi, "Back-End")
      formattedRole = formattedRole.replace(/fullstack/gi, "Full-Stack")
      let formattedLevel = level[0].toUpperCase() + level.slice(1)
      return formattedLevel + " " + formattedRole
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      let feedbackData = (await getFeedbackById(feedbackId)) as Feedback
      setFeedback(feedbackData)
      let interviewData = await getInterviewById(feedbackData?.interviewId!)
      setInterview(interviewData!)
      setRecommended(feedbackData?.totalScore > 50)
    }
    fetchData()
  }, [feedbackId])

  return (
    <div className="flex flex-col justify-center items-center my-4">
      <h1 className="text-[48px] w-[60%] text-center">
        Feedback on the Interview -{" "}
        {formatTitle(interview?.level!, interview?.role!)} Interview
      </h1>
      <div className="w-[40%] flex justify-between items-center my-2">
        <div className="flex gap-2">
          <Image src={"/star.svg"} alt="star" width={22} height={22} />
          <p>
            Overall Impression:{" "}
            {<span className="text-[#CAC5FE]">{feedback?.totalScore}</span>}
            /100
          </p>
        </div>
        <div className="flex gap-2">
          <Image src={"/calendar.svg"} alt="calendar" width={22} height={22} />
          <p>{formattedDate}</p>
        </div>
      </div>
      <div className="w-[70%] bg-[#4B4D4F80] h-[1px] my-2"></div>
      <div className="w-[60%] my-2">
        <p className="text-[18px]">{feedback?.finalAssessment}</p>
      </div>
      <div className="w-[60%] flex flex-col my-4">
        <h2>Breakdown of Assessment:</h2>
        {feedback?.categoryScores?.map((cat, index) => (
          <div className="py-4" key={index + cat.name}>
            <p className="text-[18px] font-[700] py-2">
              {index + 1 + ". "}
              {cat.name + " "}
              {`(${cat.score}/100)`}
            </p>
            <p>{cat.comment}</p>
          </div>
        ))}
      </div>
      <div className="w-[60%] flex flex-col my-4">
        <h2>Strengths:</h2>
        {feedback?.strengths?.map((strength, index) => (
          <div className="" key={index + strength}>
            <p className="text-[18px] font-[700] py-2">
              {index + 1 + ". "}
              {strength + " "}
            </p>
          </div>
        ))}
      </div>
      <div className="w-[60%] flex flex-col my-4">
        <h2>Areas for Improvement:</h2>
        {feedback?.areasForImprovement?.map((area, index) => (
          <div className="" key={index + area}>
            <p className="text-[18px] font-[700] py-2">
              {index + 1 + ". "}
              {area + " "}
            </p>
          </div>
        ))}
      </div>
      <div className="w-[60%]  flex-col">
        <div className="flex gap-4 items-center">
          <h2 className="w-fit">Final Verdict: </h2>
          <div
            className={`bg-[#27282F] p-1 w-[230px] flex justify-center items-center rounded-2xl`}
          >
            <p
              style={{
                color: recommended ? "#dafab1" : "#FF8A8A",
                fontSize: 24,
              }}
            >
              {recommended ? "Recommended" : "Not Recommended"}
            </p>
          </div>
        </div>
        <div className="py-4">
          <p>
            {recommended
              ? "This candidate answered all questions with a high level of conviction and understanding, they appear to be seriously considering the opportunity to work at the company. This would imply that it's a good idea to hire them"
              : "This candidate does not appear to be seriously considering the role and fails to provide meaningful responses. If this is reflective of their true attitude, they would not be a good fit for most positions."}
          </p>
        </div>
      </div>
      <div className="w-[60%] flex justify-between items-center my-4">
        <button
          style={{
            fontWeight: 700,
            fontSize: 16,
          }}
          type="button"
          className="w-[40%] px-4 py-2  flex justify-center items-center rounded-3xl bg-[#27282F] text-[#CAC5FE] cursor-pointer"
          onClick={() => {
            router.push("/")
          }}
        >
          Back to dashboard
        </button>
        <button
          style={{
            fontWeight: 700,
            fontSize: 16,
          }}
          type="button"
          className="w-[40%] px-4 py-2 flex justify-center items-center rounded-3xl bg-[#CAC5FE] text-[#27282F] cursor-pointer"
          onClick={() => {
            console.log(interview)
            router.push(`/interview/${feedback?.interviewId!}`)
          }}
        >
          Retake interview
        </button>
      </div>
    </div>
  )
}

export default FeedbackComponent
