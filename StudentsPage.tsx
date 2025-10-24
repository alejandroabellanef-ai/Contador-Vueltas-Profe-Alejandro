"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { storage } from "../lib/storage"
import type { Student } from "../lib/types"
import { Trash2, Download, ArrowLeft, QrCodeIcon, Printer } from "lucide-react"
import QRCode from "qrcode"
import type { NavigationProps } from "../App"

export default function StudentsPage({ navigateTo }: NavigationProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [newStudentName, setNewStudentName] = useState("")
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})

  useEffect(() => {
    setStudents(storage.getStudents())
  }, [])

  useEffect(() => {
    students.forEach(async (student) => {
      if (!qrCodes[student.id]) {
        const qrDataUrl = await QRCode.toDataURL(student.qrCode, {
          width: 400,
          margin: 2,
          errorCorrectionLevel: "H",
        })
        setQrCodes((prev) => ({ ...prev, [student.id]: qrDataUrl }))
      }
    })
  }, [students, qrCodes])

  const addStudent = () => {
    if (!newStudentName.trim()) return

    const student: Student = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      qrCode: `STUDENT-${Date.now()}`,
    }

    storage.addStudent(student)
    setStudents(storage.getStudents())
    setNewStudentName("")
  }

  const deleteStudent = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este alumno?")) {
      storage.deleteStudent(id)
      setStudents(storage.getStudents())
    }
  }

  const downloadQR = async (student: Student) => {
    const qrDataUrl = qrCodes[student.id]
    if (!qrDataUrl) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 500
    canvas.height = 600

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "#22c55e"
    ctx.lineWidth = 8
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    const img = new Image()
    img.src = qrDataUrl
    await new Promise((resolve) => {
      img.onload = resolve
    })
    ctx.drawImage(img, 50, 60, 400, 400)

    ctx.fillStyle = "#000"
    ctx.font = "bold 32px Arial"
    ctx.textAlign = "center"
    ctx.fillText(student.name, 250, 500)

    ctx.font = "18px Arial"
    ctx.fillStyle = "#666"
    ctx.fillText("Escanear en cada vuelta", 250, 540)

    const link = document.createElement("a")
    link.download = `QR-${student.name}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const downloadAllQRs = async () => {
    for (const student of students) {
      await downloadQR(student)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Alumnos</h1>
          <p className="text-muted-foreground">Añade alumnos y genera sus códigos QR para el seguimiento</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Añadir Nuevo Alumno</CardTitle>
            <CardDescription>Introduce el nombre del alumno para generar su código QR</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="studentName" className="sr-only">
                  Nombre del alumno
                </Label>
                <Input
                  id="studentName"
                  placeholder="Nombre del alumno"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addStudent()}
                  className="text-lg"
                />
              </div>
              <Button onClick={addStudent} size="lg" className="px-8">
                Añadir
              </Button>
            </div>
          </CardContent>
        </Card>

        {students.length > 0 && (
          <div className="mb-6 flex gap-3 justify-end">
            <Button variant="outline" size="lg" onClick={() => navigateTo("print-qr")}>
              <Printer className="h-5 w-5 mr-2" />
              Imprimir Todos
            </Button>
            <Button onClick={downloadAllQRs} variant="outline" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Descargar Todos
            </Button>
          </div>
        )}

        {students.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <QrCodeIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">
                No hay alumnos registrados. Añade el primero para comenzar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription className="text-xs">ID: {student.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qrCodes[student.id] && (
                    <div className="bg-white p-4 rounded-lg">
                      <img
                        src={qrCodes[student.id] || "/placeholder.svg"}
                        alt={`QR de ${student.name}`}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={() => downloadQR(student)} variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                    <Button onClick={() => deleteStudent(student.id)} variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
