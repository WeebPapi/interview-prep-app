import { db } from "@/firebase/admin"

export const getInterviewByUserId = async (userId: string) => {
  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get()

    return interviews.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Interview[]
  } catch (error) {
    console.error(error)
  }
}
export const getLatestInterviews = async (
  params: GetLatestInterviewsParams
) => {
  try {
    const { userId, limit = 20 } = params
    const interviews = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .limit(limit)
      .get()

    return interviews.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Interview[]
  } catch (error) {
    console.error(error)
  }
}

export const getInterviewById = async (id: string) => {
  try {
    const interview = await db.collection("interviews").doc(id).get()
    return interview.data() as Interview | null
  } catch (error) {
    console.error(error)
  }
}
