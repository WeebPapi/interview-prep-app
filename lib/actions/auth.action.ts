"use server"

import { auth, db } from "@/firebase/admin"
import { cookies } from "next/headers"

const FOUR_DAYS = 60 * 60 * 24 * 4

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const signUp = async (params: SignUpParams) => {
  const { uid, email, name } = params
  try {
    const userRecord = await db.collection("users").doc(uid).get()
    if (userRecord.exists) {
      return { success: false, message: "This user already exists" }
    }

    await db.collection("users").doc(uid).set({
      email,
      name,
    })
    return {
      success: true,
      message: "Successfuly created account",
    }
  } catch (error: any) {
    console.error("Error signing up", error)
    if (error.code === "auth/email-already-exists")
      return { success: false, message: "This email is already signed up" }

    return { success: false, message: "Account creation failed" }
  }
}

export const setSessionCookie = async (idToken: string) => {
  const cookieStore = await cookies()
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: 1000 * FOUR_DAYS,
  })
  cookieStore.set("session", sessionCookie, {
    maxAge: FOUR_DAYS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  })
}

export const signIn = async (params: SignInParams) => {
  const { email, idToken } = params
  try {
    const userRecord = await auth.getUserByEmail(email)
    if (!userRecord) return { success: false, message: "User does not exist" }

    await setSessionCookie(idToken)

    return { success: true, message: "Successfully signed in" }
  } catch (error: any) {
    console.error(error)
    return {
      success: false,
      message: "Failed to log into account",
    }
  }
}

export const getCurrentUser = async () => {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value

  if (!sessionCookie) return null

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
    const userRecord = await db.collection("users").doc(decodedClaims.uid).get()

    if (!userRecord.exists) return null

    return { ...userRecord.data(), id: userRecord.id } as User
  } catch (error) {
    console.error(error)
    return null
  }
}

export const isAuthenticated = async () => {
  const user = await getCurrentUser()
  return !!user
}
