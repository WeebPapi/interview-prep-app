import Agent from "@/components/Agent"
import DisplayTechIcons from "@/components/DisplayTechIcons"
import { getCurrentUser } from "@/lib/actions/auth.action"
import { getInterviewById } from "@/lib/actions/general.actions"
import { getRandomInterviewCover } from "@/lib/utils"
import Image from "next/image"
import { redirect } from "next/navigation"
import React from "react"

const Page = async ({ params }: RouteParams) => {
  const { id } = await params
  const user = await getCurrentUser()
  const interview = await getInterviewById(id)

  if (!interview) redirect("/")
  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="coer-image"
              width={40}
              height={40}
              className="object-cover rounded-full size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>
          <DisplayTechIcons techstack={interview.techstack} />
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
          {interview.type}
        </p>
      </div>
      <Agent
        userName={user?.name!}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        userId={user?.id}
      />
    </>
  )
}

export default Page
