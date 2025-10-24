"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { storage } from "../lib/storage"
import type { Student } from "../lib/types"
import { ArrowLeft, Printer } from "lucide-react"
import QRCode from "qrcode"
import type { NavigationProps } from "../App"

export default function PrintQRPage({ navigateTo }: NavigationProps) {
  const [students, setStudents] = useState<Student[]>([])
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

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <div className="min-h-screen bg-background print:hidden">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigateTo("students")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button onClick={handlePrint} size="lg">
              <Printer className="h-5 w-5 mr-2" />
              Imprimir
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Vista de Impresión</h1>
            <p className="text-muted-foreground">Haz clic en "Imprimir" para generar los códigos QR en formato A4</p>
          </div>
        </div>
      </div>

      <div className="hidden print:block">
        <style>{`
          @page {
            size: A4;
            margin: 1cm;
          }
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}</style>

        {students.map((student, index) => (
          <div
            key={student.id}
            className="flex items-center justify-center"
            style={{
              width: "100%",
              height: "50vh",
              pageBreakAfter: index % 2 === 1 ? "always" : "auto",
              pageBreakInside: "avoid",
            }}
          >
            <div
              style={{
                border: "8px solid #22c55e",
                padding: "30px",
                backgroundColor: "white",
                borderRadius: "12px",
                textAlign: "center",
                maxWidth: "450px",
              }}
            >
              {qrCodes[student.id] && (
                <img
                  src={qrCodes[student.id] || "/placeholder.svg"}
                  alt={`QR de ${student.name}`}
                  style={{ width: "350px", height: "350px", margin: "0 auto" }}
                />
              )}
              <h2 style={{ fontSize: "32px", fontWeight: "bold", marginTop: "20px", color: "#000" }}>{student.name}</h2>
              <p style={{ fontSize: "18px", color: "#666", marginTop: "10px" }}>Escanear en cada vuelta</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
