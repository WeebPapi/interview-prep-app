import { cn, getTechLogos } from "@/lib/utils"
import Image from "next/image"
import React from "react"

interface TechIconProps {
  techstack: string[]
}

const DisplayTechIcons: React.FC<TechIconProps> = async ({ techstack }) => {
  const logos = await getTechLogos(techstack)
  return (
    <div className="flex">
      {logos.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex-center",
            index >= 1 && "-ml-2.5"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            width={100}
            height={100}
            src={url}
            alt={tech}
            className="size-5"
          />
        </div>
      ))}
    </div>
  )
}

export default DisplayTechIcons
