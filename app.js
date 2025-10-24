// Storage keys
const STUDENTS_KEY = "lap_tracker_students"
const SESSIONS_KEY = "lap_tracker_sessions"
const ACTIVE_SESSION_KEY = "lap_tracker_active_session"

// Cooldown tracking
const cooldowns = new Map()
const COOLDOWN_TIME = 15000 // 15 seconds

// QR Scanner instance
let html5QrCode = null

// QRCode and Html5Qrcode declarations
const QRCode = window.QRCode
const Html5Qrcode = window.Html5Qrcode

// Storage functions
const storage = {
  getStudents() {
    const data = localStorage.getItem(STUDENTS_KEY)
    return data ? JSON.parse(data) : []
  },

  addStudent(student) {
    const students = this.getStudents()
    students.push(student)
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
  },

  deleteStudent(id) {
    const students = this.getStudents().filter((s) => s.id !== id)
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
  },

  getSessions() {
    const data = localStorage.getItem(SESSIONS_KEY)
    return data ? JSON.parse(data) : []
  },

  addSession(session) {
    const sessions = this.getSessions()
    sessions.push(session)
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  },

  updateSession(id, updates) {
    const sessions = this.getSessions()
    const index = sessions.findIndex((s) => s.id === id)
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates }
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
    }
  },

  getActiveSession() {
    return localStorage.getItem(ACTIVE_SESSION_KEY)
  },

  setActiveSession(sessionId) {
    if (sessionId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, sessionId)
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY)
    }
  },
}

// Navigation
function navigateTo(pageName) {
  // Update nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.page === pageName) {
      link.classList.add("active")
    }
  })

  // Update pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active")
  })
  document.getElementById(`page-${pageName}`).classList.add("active")

  // Initialize page-specific functionality
  if (pageName === "students") {
    renderStudentsList()
  } else if (pageName === "scanner") {
    initScanner()
  } else if (pageName === "results") {
    renderResults()
  }
}

// Add event listeners to nav links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navigateTo(link.dataset.page)
  })
})

// Students Page
document.getElementById("add-student-form").addEventListener("submit", (e) => {
  e.preventDefault()
  const name = document.getElementById("student-name").value.trim()

  if (name) {
    const student = {
      id: Date.now().toString(),
      name: name,
      qrCode: `STUDENT_${Date.now()}`,
    }

    storage.addStudent(student)
    document.getElementById("student-name").value = ""
    renderStudentsList()
  }
})

function renderStudentsList() {
  const students = storage.getStudents()
  const container = document.getElementById("students-list")

  if (students.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3>No hay alumnos</h3>
                <p>Añade tu primer alumno para comenzar</p>
            </div>
        `
    return
  }

  container.innerHTML = students
    .map(
      (student) => `
        <div class="student-item">
            <div class="student-info">
                <div>
                    <div class="student-name">${student.name}</div>
                    <div class="student-id">ID: ${student.id}</div>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-secondary btn-small" onclick="downloadQR('${student.id}')">
                    Descargar QR
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteStudent('${student.id}')">
                    Eliminar
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function deleteStudent(id) {
  if (confirm("¿Estás seguro de que quieres eliminar este alumno?")) {
    storage.deleteStudent(id)
    renderStudentsList()
  }
}

function downloadQR(studentId) {
  const students = storage.getStudents()
  const student = students.find((s) => s.id === studentId)

  if (student) {
    const canvas = document.createElement("canvas")
    QRCode.toCanvas(
      canvas,
      student.qrCode,
      {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "H",
      },
      (error) => {
        if (error) {
          alert("Error al generar el código QR")
          return
        }

        // Download canvas as image
        const link = document.createElement("a")
        link.download = `QR_${student.name.replace(/\s+/g, "_")}.png`
        link.href = canvas.toDataURL()
        link.click()
      },
    )
  }
}

function printAllQR() {
  const students = storage.getStudents()

  if (students.length === 0) {
    alert("No hay alumnos para imprimir")
    return
  }

  const container = document.getElementById("print-qr-container")
  container.innerHTML = '<div class="print-qr-grid"></div>'
  const grid = container.querySelector(".print-qr-grid")

  students.forEach((student) => {
    const item = document.createElement("div")
    item.className = "print-qr-item"
    item.innerHTML = `
            <h3>${student.name}</h3>
            <canvas id="qr-${student.id}"></canvas>
            <p>Escanea este código en cada vuelta</p>
        `
    grid.appendChild(item)

    QRCode.toCanvas(document.getElementById(`qr-${student.id}`), student.qrCode, {
      width: 250,
      margin: 2,
      errorCorrectionLevel: "H",
    })
  })

  container.style.display = "block"
  setTimeout(() => {
    window.print()
    container.style.display = "none"
  }, 500)
}

// Session Page
document.getElementById("new-session-form").addEventListener("submit", (e) => {
  e.preventDefault()

  const name = document.getElementById("session-name").value.trim()
  const distance = Number.parseInt(document.getElementById("distance-per-lap").value)

  if (name && distance > 0) {
    const session = {
      id: Date.now().toString(),
      name: name,
      distancePerLap: distance,
      startTime: Date.now(),
      laps: [],
      isActive: true,
    }

    storage.addSession(session)
    storage.setActiveSession(session.id)

    document.getElementById("session-name").value = ""
    document.getElementById("distance-per-lap").value = ""

    alert("Sesión iniciada correctamente")
    navigateTo("scanner")
  }
})

// Scanner Page
function initScanner() {
  const activeSessionId = storage.getActiveSession()

  if (!activeSessionId) {
    document.getElementById("scanner-status").textContent = "No hay sesión activa. Crea una nueva sesión primero."
    document.getElementById("qr-reader").innerHTML =
      '<div class="empty-state"><div class="empty-state-icon">📷</div><h3>No hay sesión activa</h3><p>Crea una nueva sesión para comenzar a escanear</p></div>'
    return
  }

  const sessions = storage.getSessions()
  const session = sessions.find((s) => s.id === activeSessionId)

  if (!session) {
    document.getElementById("scanner-status").textContent = "Error: Sesión no encontrada"
    return
  }

  document.getElementById("scanner-status").textContent = `Sesión activa: ${session.name}`

  // Initialize QR scanner
  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("qr-reader")
  }

  html5QrCode
    .start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanError,
    )
    .catch((err) => {
      console.error("Error starting scanner:", err)
      document.getElementById("qr-reader").innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">⚠️</div><h3>Error al iniciar la cámara</h3><p>Asegúrate de dar permisos de cámara</p></div>'
    })

  renderRecentScans()
}

function onScanSuccess(decodedText) {
  const activeSessionId = storage.getActiveSession()
  const sessions = storage.getSessions()
  const session = sessions.find((s) => s.id === activeSessionId)

  if (!session) return

  // Check if student exists
  const students = storage.getStudents()
  const student = students.find((s) => s.qrCode === decodedText)

  if (!student) {
    console.log("QR code not recognized:", decodedText)
    return
  }

  // Check cooldown
  const now = Date.now()
  const lastScan = cooldowns.get(student.id)

  if (lastScan && now - lastScan < COOLDOWN_TIME) {
    console.log("Student in cooldown:", student.name)
    return
  }

  // Add lap
  const studentLaps = session.laps.filter((l) => l.studentId === student.id)
  const lapNumber = studentLaps.length + 1
  const lastLap = studentLaps[studentLaps.length - 1]
  const lapTime = lastLap ? now - lastLap.timestamp : null

  const lap = {
    studentId: student.id,
    timestamp: now,
    lapNumber: lapNumber,
    lapTime: lapTime,
  }

  session.laps.push(lap)
  storage.updateSession(session.id, session)

  // Set cooldown
  cooldowns.set(student.id, now)

  // Update UI
  document.getElementById("last-scan").textContent = student.name
  document.getElementById("total-scans").textContent = session.laps.length

  renderRecentScans()
}

function onScanError(error) {
  // Ignore scan errors (they happen frequently)
}

function renderRecentScans() {
  const activeSessionId = storage.getActiveSession()
  const sessions = storage.getSessions()
  const session = sessions.find((s) => s.id === activeSessionId)

  if (!session) return

  const students = storage.getStudents()
  const container = document.getElementById("recent-scans")
  const now = Date.now()

  const recentLaps = session.laps.slice(-10).reverse()

  if (recentLaps.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No hay escaneos todavía</p></div>'
    return
  }

  container.innerHTML = recentLaps
    .map((lap) => {
      const student = students.find((s) => s.id === lap.studentId)
      const inCooldown = cooldowns.get(lap.studentId) && now - cooldowns.get(lap.studentId) < COOLDOWN_TIME
      const timeAgo = Math.floor((now - lap.timestamp) / 1000)

      return `
            <div class="scan-item ${inCooldown ? "cooldown" : ""}">
                <div class="scan-info-text">
                    <div class="scan-student">${student ? student.name : "Desconocido"}</div>
                    <div class="scan-details">
                        Vuelta ${lap.lapNumber}
                        ${lap.lapTime ? ` - Tiempo: ${formatTime(lap.lapTime)}` : ""}
                    </div>
                </div>
                <div class="scan-time">Hace ${timeAgo}s</div>
            </div>
        `
    })
    .join("")
}

function endSession() {
  if (confirm("¿Estás seguro de que quieres finalizar la sesión?")) {
    const activeSessionId = storage.getActiveSession()

    if (activeSessionId) {
      storage.updateSession(activeSessionId, { isActive: false })
      storage.setActiveSession(null)

      if (html5QrCode) {
        html5QrCode
          .stop()
          .then(() => {
            html5QrCode = null
          })
          .catch((err) => console.error(err))
      }

      alert("Sesión finalizada")
      navigateTo("results")
    }
  }
}

// Results Page
function renderResults() {
  const sessions = storage.getSessions()
  const students = storage.getStudents()
  const container = document.getElementById("sessions-list")

  if (sessions.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <h3>No hay sesiones</h3>
                <p>Crea una sesión para ver resultados</p>
            </div>
        `
    return
  }

  container.innerHTML = sessions
    .slice()
    .reverse()
    .map((session) => {
      const stats = calculateSessionStats(session, students)

      return `
            <div class="session-card">
                <div class="session-header">
                    <div>
                        <h3 class="session-title">${session.name}</h3>
                        <div class="session-meta">
                            ${new Date(session.startTime).toLocaleString("es-ES")}
                            - ${session.distancePerLap}m por vuelta
                            ${session.isActive ? " - <strong>ACTIVA</strong>" : ""}
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-small" onclick="exportSessionCSV('${session.id}')">
                        Exportar CSV
                    </button>
                </div>
                
                <div class="session-stats">
                    <div class="stat-item">
                        <div class="stat-value">${session.laps.length}</div>
                        <div class="stat-label">Total Vueltas</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.totalStudents}</div>
                        <div class="stat-label">Alumnos Participantes</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.totalDistance}m</div>
                        <div class="stat-label">Distancia Total</div>
                    </div>
                </div>
                
                <div class="student-results">
                    <h4>Resultados por Alumno</h4>
                    ${stats.studentStats
                      .map(
                        (stat) => `
                        <div class="student-result-item">
                            <div class="student-result-header">
                                <span class="student-result-name">${stat.studentName}</span>
                                <span class="student-result-laps">${stat.totalLaps} vueltas</span>
                            </div>
                            <div class="student-result-stats">
                                <div>Distancia: ${stat.totalDistance}m</div>
                                <div>Tiempo medio: ${stat.averageLapTime ? formatTime(stat.averageLapTime) : "N/A"}</div>
                                <div>Mejor vuelta: ${stat.fastestLap ? formatTime(stat.fastestLap) : "N/A"}</div>
                                <div>Peor vuelta: ${stat.slowestLap ? formatTime(stat.slowestLap) : "N/A"}</div>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `
    })
    .join("")
}

function calculateSessionStats(session, students) {
  const studentMap = new Map()

  session.laps.forEach((lap) => {
    if (!studentMap.has(lap.studentId)) {
      const student = students.find((s) => s.id === lap.studentId)
      studentMap.set(lap.studentId, {
        studentId: lap.studentId,
        studentName: student ? student.name : "Desconocido",
        totalLaps: 0,
        totalDistance: 0,
        lapTimes: [],
      })
    }

    const stat = studentMap.get(lap.studentId)
    stat.totalLaps++
    stat.totalDistance = stat.totalLaps * session.distancePerLap

    if (lap.lapTime) {
      stat.lapTimes.push(lap.lapTime)
    }
  })

  const studentStats = Array.from(studentMap.values()).map((stat) => {
    const validTimes = stat.lapTimes.filter((t) => t > 0)

    return {
      ...stat,
      averageLapTime: validTimes.length > 0 ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length : null,
      fastestLap: validTimes.length > 0 ? Math.min(...validTimes) : null,
      slowestLap: validTimes.length > 0 ? Math.max(...validTimes) : null,
    }
  })

  return {
    totalStudents: studentMap.size,
    totalDistance: session.laps.length * session.distancePerLap,
    studentStats: studentStats.sort((a, b) => b.totalLaps - a.totalLaps),
  }
}

function exportSessionCSV(sessionId) {
  const sessions = storage.getSessions()
  const session = sessions.find((s) => s.id === sessionId)
  const students = storage.getStudents()

  if (!session) return

  const stats = calculateSessionStats(session, students)

  let csv = "Alumno,Vueltas,Distancia (m),Tiempo Medio,Mejor Vuelta,Peor Vuelta\n"

  stats.studentStats.forEach((stat) => {
    csv += `${stat.studentName},${stat.totalLaps},${stat.totalDistance},`
    csv += `${stat.averageLapTime ? formatTime(stat.averageLapTime) : "N/A"},`
    csv += `${stat.fastestLap ? formatTime(stat.fastestLap) : "N/A"},`
    csv += `${stat.slowestLap ? formatTime(stat.slowestLap) : "N/A"}\n`
  })

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${session.name.replace(/\s+/g, "_")}_resultados.csv`
  link.click()
}

// Utility functions
function formatTime(ms) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  return `${seconds}s`
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  renderStudentsList()
})

// Update recent scans every 2 seconds when scanner is active
setInterval(() => {
  const activePage = document.querySelector(".page.active")
  if (activePage && activePage.id === "page-scanner") {
    renderRecentScans()
  }
}, 2000)
