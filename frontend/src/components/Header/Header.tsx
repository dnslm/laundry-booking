import Navigation from '../Navigation/Navigation'
import './Header.css'

function Header() {
  const handleLogout = () => {
    alert('Выход из аккаунта пока не подключён.')
  }

  return (
    <header className="header">
      <a href="/" className="header-logo">
        Laundry Booking
      </a>

      <Navigation />

      <div className="header-user">
        <span className="user-avatar">Г</span>
        <span>Гость</span>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Выйти
        </button>
      </div>
    </header>
  )
}

export default Header