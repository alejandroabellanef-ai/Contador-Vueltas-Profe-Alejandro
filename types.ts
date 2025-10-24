export interface Student {
  id: string
  name: string
  qrCode: string
}

export interface Lap {
  studentId: string
  timestamp: number
  lapNumber: number
  lapTime: number | null
}

export interface Session {
  id: string
  name: string
  distancePerLap: number
  startTime: number
  laps: Lap[]
  isActive: boolean
}

export interface StudentStats {
  studentId: string
  studentName: string
  totalLaps: number
  totalDistance: number
  averageLapTime: number | null
  fastestLap: number | null
  slowestLap: number | null
  lapTimes: number[]
}
