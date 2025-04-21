import React from "react"
import dayjs from "dayjs"
import Image from "next/image"
import { getRandomInterviewCover } from "@/lib/utils"
import { Button } from "./ui/button"
import Link from "next/link"
import DisplayTechIcons from "./DisplayTechIcons"
import {
  getFeedbackByInterviewId,
  getInterviewById,
  getInterviewByUserId,
} from "@/lib/actions/general.actions"
import { getCurrentUser } from "@/lib/actions/auth.action"

const InterviewCard: React.FC<InterviewCardProps> = async ({
  role,
  techstack,
  type,
  createdAt,
  id,
  userId,
}) => {
  const user = await getCurrentUser()
  const feedback = await getFeedbackByInterviewId(id!)
  const interview = await getInterviewById(id!)
  const finished = feedback && interview?.userId === user?.id
  const normalizedType = /max/gi.test(type) ? "Mix" : type
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY")
  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>
          <Image
            src={getRandomInterviewCover()}
            alt="cover image"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px]"
          />
          <h3 className="mt-5 capitalize">{role} Interview</h3>
          <div className="flex gap-5 mt-3">
            <div className="flex gap-2">
              <Image
                src={"/calendar.svg"}
                alt="calendar"
                width={22}
                height={22}
              />
              <p>{formattedDate}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Image src={"/star.svg"} alt="star" width={22} height={22} />
              <p>{finished ? feedback?.totalScore : "---"}/100</p>
            </div>
          </div>
          <p className="line-clamp-2 mt-5">
            {finished
              ? feedback?.finalAssessment
              : "You haven't taken the interview yet, take it now?"}
          </p>
        </div>
        <div className="flex justify-between">
          <DisplayTechIcons techstack={techstack} />
          <Button className="btn-primary">
            <Link
              href={
                finished
                  ? `/interview/${id}/feedback?id=${feedback.id}`
                  : `/interview/${id}`
              }
            >
              {finished ? "Check Feedback" : "Take Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard
