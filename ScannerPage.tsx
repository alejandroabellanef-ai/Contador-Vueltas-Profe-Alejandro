"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { storage } from "../lib/storage"
import type { Session, Student, Lap } from "../lib/types"
import { ArrowLeft, StopCircle, CheckCircle2, XCircle } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import type { NavigationProps } from "../App"

export default function ScannerPage({ navigateTo }: NavigationProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [lastScans, setLastScans] = useState<Record<string, number>>({})
  const [scanMessage, setScanMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [recentLaps, setRecentLaps] = useState<Array<{ studentName: string; lapNumber: number }>>([])

  useEffect(() => {
    const activeSessionId = storage.getActiveSession()
    if (!activeSessionId) {
      navigateTo("new-session")
      return
    }

    const sessions = storage.getSessions()
    const activeSession = sessions.find((s) => s.id === activeSessionId)
    if (!activeSession) {
      navigateTo("new-session")
      return
    }

    setSession(activeSession)
    setStudents(storage.getStudents())
  }, [navigateTo])

  useEffect(() => {
    if (!session) return

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader")
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          onScanSuccess,
          () => {
            // Ignore scan failures
          },
        )
        setIsScanning(true)
      } catch (err) {
        console.error("Error starting scanner:", err)
        showMessage("error", "Error al iniciar la cámara. Verifica los permisos.")
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [session])

  const onScanSuccess = (decodedText: string) => {
    if (!session) return

    const student = students.find((s) => s.qrCode === decodedText)
    if (!student) {
      showMessage("error", "Código QR no reconocido")
      return
    }

    const now = Date.now()
    const lastScan = lastScans[student.id]

    if (lastScan && now - lastScan < 15000) {
      const remainingSeconds = Math.ceil((15000 - (now - lastScan)) / 1000)
      showMessage("error", `${student.name}: Espera ${remainingSeconds}s`)
      return
    }

    const studentLaps = session.laps.filter((l) => l.studentId === student.id)
    const lapNumber = studentLaps.length + 1
    const previousLap = studentLaps[studentLaps.length - 1]
    const lapTime = previousLap ? now - previousLap.timestamp : null

    const lap: Lap = {
      studentId: student.id,
      timestamp: now,
      lapNumber,
      lapTime,
    }

    session.laps.push(lap)
    storage.updateSession(session.id, { laps: session.laps })

    setLastScans((prev) => ({ ...prev, [student.id]: now }))
    setSession({ ...session })

    setRecentLaps((prev) => [{ studentName: student.name, lapNumber }, ...prev.slice(0, 4)])

    const timeText = lapTime ? ` - ${formatTime(lapTime)}` : ""
    showMessage("success", `${student.name} - Vuelta ${lapNumber}${timeText}`)
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setScanMessage({ type, text })
    setTimeout(() => setScanMessage(null), 3000)
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const endSession = async () => {
    if (!session) return

    if (confirm("¿Finalizar la sesión?")) {
      storage.updateSession(session.id, { isActive: false })
      storage.setActiveSession(null)

      if (scannerRef.current) {
        await scannerRef.current.stop()
      }

      navigateTo("results", { session: session.id })
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  const totalLaps = session.laps.length
  const uniqueStudents = new Set(session.laps.map((l) => l.studentId)).size

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigateTo("home")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{session.name}</h1>
          <p className="text-muted-foreground">Distancia por vuelta: {session.distancePerLap}m</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Vueltas</p>
                <p className="text-3xl font-bold text-primary">{totalLaps}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Alumnos Activos</p>
                <p className="text-3xl font-bold text-primary">{uniqueStudents}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Tiempo Sesión</p>
                <p className="text-3xl font-bold text-primary">{formatTime(Date.now() - session.startTime)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Escáner QR</CardTitle>
            <CardDescription>Apunta la cámara al código QR del alumno</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div id="qr-reader" className="w-full rounded-lg overflow-hidden bg-black"></div>
              {!isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <p className="text-white">Iniciando cámara...</p>
                </div>
              )}
            </div>

            {scanMessage && (
              <div
                className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                  scanMessage.type === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                }`}
              >
                {scanMessage.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <p className="font-semibold">{scanMessage.text}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {recentLaps.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Últimas Vueltas Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentLaps.map((lap, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{lap.studentName}</span>
                    <span className="text-sm text-muted-foreground">Vuelta {lap.lapNumber}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button onClick={endSession} variant="destructive" size="lg" className="flex-1">
            <StopCircle className="h-5 w-5 mr-2" />
            Finalizar Sesión
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 bg-transparent"
            onClick={() => navigateTo("results", { session: session.id })}
          >
            Ver Resultados
          </Button>
        </div>
      </div>
    </div>
  )
}
