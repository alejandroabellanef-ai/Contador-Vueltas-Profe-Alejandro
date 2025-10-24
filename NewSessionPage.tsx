"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { storage } from "../lib/storage"
import type { Session } from "../lib/types"
import { ArrowLeft, Play } from "lucide-react"
import type { NavigationProps } from "../App"

export default function NewSessionPage({ navigateTo }: NavigationProps) {
  const [sessionName, setSessionName] = useState("")
  const [distancePerLap, setDistancePerLap] = useState("400")
  const [hasStudents, setHasStudents] = useState(false)

  useEffect(() => {
    const students = storage.getStudents()
    setHasStudents(students.length > 0)
  }, [])

  const createSession = () => {
    if (!sessionName.trim() || !distancePerLap) return

    const distance = Number.parseFloat(distancePerLap)
    if (isNaN(distance) || distance <= 0) {
      alert("Por favor, introduce una distancia válida")
      return
    }

    const session: Session = {
      id: Date.now().toString(),
      name: sessionName.trim(),
      distancePerLap: distance,
      startTime: Date.now(),
      laps: [],
      isActive: true,
    }

    storage.addSession(session)
    storage.setActiveSession(session.id)
    navigateTo("scanner")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigateTo("home")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Nueva Sesión</h1>
          <p className="text-muted-foreground">Configura los parámetros de la sesión de entrenamiento</p>
        </div>

        {!hasStudents && (
          <Card className="mb-6 border-accent">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                ⚠️ No hay alumnos registrados. Necesitas añadir alumnos antes de crear una sesión.
              </p>
              <Button variant="outline" size="sm" onClick={() => navigateTo("students")}>
                Ir a Gestión de Alumnos
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Configuración de la Sesión</CardTitle>
            <CardDescription>Define el nombre y la distancia por vuelta del circuito</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sessionName">Nombre de la Sesión</Label>
              <Input
                id="sessionName"
                placeholder="Ej: Circuito Pista - 21 Octubre"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Identifica esta sesión para futuras consultas</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Distancia por Vuelta (metros)</Label>
              <Input
                id="distance"
                type="number"
                placeholder="400"
                value={distancePerLap}
                onChange={(e) => setDistancePerLap(e.target.value)}
                min="1"
                step="1"
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Introduce la longitud del circuito en metros</p>
            </div>

            <div className="pt-4">
              <Button
                onClick={createSession}
                disabled={!hasStudents || !sessionName.trim() || !distancePerLap}
                size="lg"
                className="w-full"
              >
                <Play className="h-5 w-5 mr-2" />
                Iniciar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-sm">Consejos:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>Mide la distancia del circuito antes de comenzar</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Asegúrate de que todos los alumnos tienen su código QR impreso</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Colócate en la zona de control con el móvil listo para escanear</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>El sistema evita escaneos duplicados en menos de 15 segundos</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
