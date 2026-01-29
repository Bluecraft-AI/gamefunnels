'use client'

export default function StickFighterPage() {
  return (
    <iframe
      src="/stick-fighter/index.html"
      style={{
        width: '100vw',
        height: '100vh',
        border: 'none',
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0
      }}
      title="Stick Fighter"
    />
  )
}
