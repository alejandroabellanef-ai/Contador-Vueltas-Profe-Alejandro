"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Users, QrCode, Play, BarChart3 } from "lucide-react"
import type { NavigationProps } from "../App"

export default function HomePage({ navigateTo }: NavigationProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Control de Vueltas QR</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Sistema de seguimiento de circuitos para Educación Física
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gestionar Alumnos</CardTitle>
              </div>
              <CardDescription>Añade alumnos y genera sus códigos QR personalizados</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" onClick={() => navigateTo("students")}>
                Ir a Alumnos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Play className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Nueva Sesión</CardTitle>
              </div>
              <CardDescription>Configura una nueva sesión de entrenamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" variant="secondary" onClick={() => navigateTo("new-session")}>
                Crear Sesión
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Escanear QR</CardTitle>
              </div>
              <CardDescription>Escanea códigos QR durante la actividad</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" onClick={() => navigateTo("scanner")}>
                Abrir Escáner
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Ver Resultados</CardTitle>
              </div>
              <CardDescription>Consulta estadísticas y resultados de sesiones</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" variant="secondary" onClick={() => navigateTo("results")}>
                Ver Estadísticas
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">¿Cómo funciona?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <p>Añade a tus alumnos y genera sus códigos QR únicos</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p>Imprime los códigos QR para que los alumnos los lleven durante la actividad</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <p>Crea una nueva sesión y configura la distancia por vuelta</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <p>Escanea automáticamente los QR cuando los alumnos pasen por la zona de control</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">5.</span>
              <p>Consulta las estadísticas en tiempo real: vueltas, tiempos y distancia recorrida</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
