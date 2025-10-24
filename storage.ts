import type { Student, Session } from "./types"

const STUDENTS_KEY = "lap_tracker_students"
const SESSIONS_KEY = "lap_tracker_sessions"
const ACTIVE_SESSION_KEY = "lap_tracker_active_session"

export const storage = {
  getStudents(): Student[] {
    const data = localStorage.getItem(STUDENTS_KEY)
    return data ? JSON.parse(data) : []
  },

  addStudent(student: Student): void {
    const students = this.getStudents()
    students.push(student)
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
  },

  deleteStudent(id: string): void {
    const students = this.getStudents().filter((s) => s.id !== id)
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
  },

  getSessions(): Session[] {
    const data = localStorage.getItem(SESSIONS_KEY)
    return data ? JSON.parse(data) : []
  },

  addSession(session: Session): void {
    const sessions = this.getSessions()
    sessions.push(session)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  },

  updateSession(id: string, updates: Partial<Session>): void {
    const sessions = this.getSessions()
    const index = sessions.findIndex((s) => s.id === id)
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates }
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
    }
  },

  getActiveSession(): string | null {
    return localStorage.getItem(ACTIVE_SESSION_KEY)
  },

  setActiveSession(sessionId: string | null): void {
    if (sessionId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, sessionId)
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY)
    }
  },
}
