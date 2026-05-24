import { RepositoryContext } from '@graeseo/presentation'
import {
  StaticStockEventRepository,
  StaticScenarioRepository,
  StaticMarketTopicRepository,
  StaticStockRepository,
} from '@graeseo/data'
import { MainFeedPage } from './components/MainFeedPage'

const repositories = {
  stockEventRepository: new StaticStockEventRepository(),
  scenarioRepository: new StaticScenarioRepository(),
  marketTopicRepository: new StaticMarketTopicRepository(),
  stockRepository: new StaticStockRepository(),
}

function App() {
  return (
    <RepositoryContext.Provider value={repositories}>
      <MainFeedPage />
    </RepositoryContext.Provider>
  )
}

export default App
