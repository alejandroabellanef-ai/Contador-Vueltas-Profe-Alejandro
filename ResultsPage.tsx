"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { storage } from "../lib/storage"
import type { Session, Student, StudentStats } from "../lib/types"
import { ArrowLeft, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import type { NavigationProps } from "../App"

export default function ResultsPage({ navigateTo, params }: NavigationProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<StudentStats[]>([])

  useEffect(() => {
    const allSessions = storage.getSessions()
    setSessions(allSessions)
    setStudents(storage.getStudents())

    if (params.session) {
      setSelectedSessionId(params.session)
    } else if (allSessions.length > 0) {
      setSelectedSessionId(allSessions[allSessions.length - 1].id)
    }
  }, [params.session])

  useEffect(() => {
    if (!selectedSessionId) return

    const session = sessions.find((s) => s.id === selectedSessionId)
    if (!session) return

    const studentStats: StudentStats[] = students.map((student) => {
      const studentLaps = session.laps.filter((l) => l.studentId === student.id)
      const lapTimes = studentLaps.map((l) => l.lapTime).filter((t): t is number => t !== null)

      const totalLaps = studentLaps.length
      const totalDistance = totalLaps * session.distancePerLap
      const averageLapTime = lapTimes.length > 0 ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length : null
      const fastestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : null
      const slowestLap = lapTimes.length > 0 ? Math.max(...lapTimes) : null

      return {
        studentId: student.id,
        studentName: student.name,
        totalLaps,
        totalDistance,
        averageLapTime,
        fastestLap,
        slowestLap,
        lapTimes,
      }
    })

    studentStats.sort((a, b) => b.totalLaps - a.totalLaps)
    setStats(studentStats)
  }, [selectedSessionId, sessions, students])

  const formatTime = (ms: number | null) => {
    if (ms === null) return "-"
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`
    }
    return `${meters} m`
  }

  const exportToCSV = () => {
    if (!selectedSessionId) return

    const session = sessions.find((s) => s.id === selectedSessionId)
    if (!session) return

    const headers = ["Posición", "Alumno", "Vueltas", "Distancia Total", "Tiempo Medio", "Mejor Vuelta", "Peor Vuelta"]

    const rows = stats.map((stat, index) => [
      index + 1,
      stat.studentName,
      stat.totalLaps,
      formatDistance(stat.totalDistance),
      formatTime(stat.averageLapTime),
      formatTime(stat.fastestLap),
      formatTime(stat.slowestLap),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `resultados-${session.name}.csv`
    link.click()
  }

  const selectedSession = sessions.find((s) => s.id === selectedSessionId)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigateTo("home")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Resultados</h1>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <Select value={selectedSessionId || ""} onValueChange={setSelectedSessionId}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Selecciona una sesión" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSession && (
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            )}
          </div>
        </div>

        {!selectedSession ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No hay sesiones disponibles. Crea una nueva sesión para comenzar.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Distancia/Vuelta</p>
                    <p className="text-2xl font-bold text-primary">{selectedSession.distancePerLap}m</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Vueltas</p>
                    <p className="text-2xl font-bold text-primary">{selectedSession.laps.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Participantes</p>
                    <p className="text-2xl font-bold text-primary">
                      {new Set(selectedSession.laps.map((l) => l.studentId)).size}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Estado</p>
                    <p className="text-2xl font-bold text-primary">
                      {selectedSession.isActive ? "Activa" : "Finalizada"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Clasificación</CardTitle>
                <CardDescription>Resultados ordenados por número de vueltas completadas</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.length === 0 || stats.every((s) => s.totalLaps === 0) ? (
                  <p className="text-center text-muted-foreground py-8">No hay datos registrados para esta sesión</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-semibold text-sm">Pos.</th>
                          <th className="text-left py-3 px-2 font-semibold text-sm">Alumno</th>
                          <th className="text-center py-3 px-2 font-semibold text-sm">Vueltas</th>
                          <th className="text-center py-3 px-2 font-semibold text-sm">Distancia</th>
                          <th className="text-center py-3 px-2 font-semibold text-sm hidden sm:table-cell">
                            Tiempo Medio
                          </th>
                          <th className="text-center py-3 px-2 font-semibold text-sm hidden md:table-cell">
                            Mejor Vuelta
                          </th>
                          <th className="text-center py-3 px-2 font-semibold text-sm hidden lg:table-cell">
                            Peor Vuelta
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats
                          .filter((stat) => stat.totalLaps > 0)
                          .map((stat, index) => (
                            <tr key={stat.studentId} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-2">
                                <span className="font-bold text-primary">{index + 1}</span>
                              </td>
                              <td className="py-3 px-2 font-medium">{stat.studentName}</td>
                              <td className="py-3 px-2 text-center">{stat.totalLaps}</td>
                              <td className="py-3 px-2 text-center">{formatDistance(stat.totalDistance)}</td>
                              <td className="py-3 px-2 text-center hidden sm:table-cell">
                                {formatTime(stat.averageLapTime)}
                              </td>
                              <td className="py-3 px-2 text-center hidden md:table-cell">
                                {formatTime(stat.fastestLap)}
                              </td>
                              <td className="py-3 px-2 text-center hidden lg:table-cell">
                                {formatTime(stat.slowestLap)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
