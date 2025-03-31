import Image from "next/image"
import Link from "next/link"
import React from "react"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="root-layout">
      <nav className="w-full flex justify-between items-center">
        <Link className="flex items-center gap-2" href={"/"}>
          <Image src={"/logo.svg"} alt="prepwise logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout
