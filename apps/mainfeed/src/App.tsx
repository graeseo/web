import { RepositoryContext } from '@graeseo/presentation'
import { StaticStockEventRepository, StaticScenarioRepository } from '@graeseo/data'
import { EventList } from './components/EventList'

const repositories = {
  stockEventRepository: new StaticStockEventRepository(),
  scenarioRepository: new StaticScenarioRepository(),
}

function App() {
  return (
    <RepositoryContext.Provider value={repositories}>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">그래서</h1>
          <p className="app-subtitle">이 이벤트, 내 종목에 어떤 의미야?</p>
        </header>
        <EventList />
      </div>
    </RepositoryContext.Provider>
  )
}

export default App
