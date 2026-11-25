import './NotFound.css';

function NotFound() {
  return (
    <main className="not-found">
      <h1>404</h1>

      <h2>Страница не найдена</h2>

      <p>К сожалению, такой страницы не существует или она была перемещена.</p>

      <a href="/">Вернуться на главную</a>
    </main>
  );
}

export default NotFound;
