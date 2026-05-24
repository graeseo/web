import { useState } from 'react'
import type { StockEvent } from '@graeseo/domain'
import { RepositoryContext } from '@graeseo/presentation'
import { StaticStockEventRepository, StaticScenarioRepository } from '@graeseo/data'
import { EventList } from './components/EventList'
import { ScenarioDetail } from './components/ScenarioDetail'

const repositories = {
  stockEventRepository: new StaticStockEventRepository(),
  scenarioRepository: new StaticScenarioRepository(),
}

function App() {
  const [selectedEvent, setSelectedEvent] = useState<StockEvent | null>(null)

  return (
    <RepositoryContext.Provider value={repositories}>
      <div className="app">
        {selectedEvent ? (
          <ScenarioDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} />
        ) : (
          <>
            <header className="app-header">
              <h1 className="app-title">그래서</h1>
              <p className="app-subtitle">이 이벤트, 내 종목에 어떤 의미야?</p>
            </header>
            <EventList onSelectEvent={setSelectedEvent} />
          </>
        )}
      </div>
    </RepositoryContext.Provider>
  )
}

export default App
