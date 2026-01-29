'use client'

interface GameCardProps {
  title: string
  description: string
  imageUrl?: string
  imageAlt?: string
  href: string
  placeholder?: React.ReactNode
  comingSoon?: boolean
}

export default function GameCard({
  title,
  description,
  imageUrl,
  imageAlt,
  href,
  placeholder,
  comingSoon = false,
}: GameCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        if (!comingSoon) {
          e.currentTarget.style.transform = 'translateY(-5px)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '220px',
          backgroundColor: '#ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontWeight: 'bold',
          overflow: 'hidden',
        }}
      >
        {placeholder ? (
          placeholder
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'bottom',
              borderRadius: '8px',
            }}
          />
        ) : (
          <div>No Image</div>
        )}
      </div>
      <div style={{ padding: '1.5rem' }}>
        <h3
          style={{
            marginTop: '10px',
            marginBottom: '0.5rem',
            color: '#0078d7',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: '#666',
            marginBottom: '1.5rem',
          }}
        >
          {description}
        </p>
        {comingSoon ? (
          <a
            href="#"
            style={{
              display: 'inline-block',
              backgroundColor: '#999',
              color: 'white',
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
            }}
          >
            Coming Soon
          </a>
        ) : (
          <a
            href={href}
            style={{
              display: 'inline-block',
              backgroundColor: '#0078d7',
              color: 'white',
              padding: '0.5rem 1rem',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#005fa3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0078d7'
            }}
          >
            Play Now
          </a>
        )}
      </div>
    </div>
  )
}
