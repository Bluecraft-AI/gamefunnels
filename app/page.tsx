import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GameCard from '@/components/GameCard'

export default function Home() {
  const games = [
    {
      title: 'Stick Fighter',
      description: 'A retro-themed stick figure fighting game. Challenge a friend to a local multiplayer duel!',
      imageUrl: '/images/Stick Fighter Image.png',
      imageAlt: 'Stick Fighter Game Screenshot',
      href: '/stick-fighter/',
    },
    {
      title: 'Stick Shooter',
      description: 'A retro-themed stick figure shooting game. Fight off waves of enemies and collect power ups to become the ultimate stick shooter!',
      imageUrl: '/images/Stick Shooter Game.png',
      imageAlt: 'Stick Shooter Game Screenshot',
      href: '/stick-shooter/',
    },
    {
      title: 'Stick Bird',
      description: 'Classic Stick Bird gameplay! Navigate through pipes and try to achieve the highest score. Press SPACE or click to flap!',
      imageUrl: '/images/Stick Bird Game.png',
      imageAlt: 'Stick Bird Game Screenshot',
      href: '/stick-bird/',
    },
  ]

  return (
    <>
      <Header />
      <div className="container">
        <h2>Available Games</h2>
        <div className="games-grid">
          {games.map((game) => (
            <GameCard
              key={game.title}
              title={game.title}
              description={game.description}
              imageUrl={game.imageUrl}
              imageAlt={game.imageAlt}
              href={game.href}
            />
          ))}
          <GameCard
            title="More Games Coming Soon"
            description="Stay tuned for more retro-inspired games that will be added to our collection!"
            href="#"
            placeholder={<div>Coming Soon</div>}
            comingSoon={true}
          />
        </div>
      </div>
      <Footer />
    </>
  )
}
