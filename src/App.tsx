import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Plant care reminders</h1>
        <p className="app-tagline">
          Track watering and fertilizing — runs locally in your browser.
        </p>
      </header>

      <main className="app-main">
        <section className="region" aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className="region-title">
            Tasks
          </h2>
          <p className="region-placeholder">
            Overdue, due today, and upcoming will go here.
          </p>
        </section>

        <section className="region" aria-labelledby="plants-heading">
          <h2 id="plants-heading" className="region-title">
            Plants
          </h2>
          <p className="region-placeholder">
            Plant list and add/edit will go here.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
