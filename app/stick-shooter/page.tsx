'use client'

export default function StickShooterPage() {
  return (
    <iframe
      src="/stick-shooter/index.html"
      style={{
        width: '100vw',
        height: '100vh',
        border: 'none',
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0
      }}
      title="Stick Shooter"
    />
  )
}
