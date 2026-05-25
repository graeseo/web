import { RepositoryContext } from '@graeseo/presentation'
import {
  HttpStockEventRepository,
  HttpScenarioRepository,
  HttpMarketTopicRepository,
  HttpStockRepository,
} from '@graeseo/data'
import { MainFeedPage } from './components/MainFeedPage'

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

if (import.meta.env.PROD && !baseUrl) {
  throw new Error('VITE_API_BASE_URL must be set in production')
}

const repositories = {
  stockEventRepository: new HttpStockEventRepository(baseUrl),
  scenarioRepository: new HttpScenarioRepository(baseUrl),
  marketTopicRepository: new HttpMarketTopicRepository(baseUrl),
  stockRepository: new HttpStockRepository(baseUrl),
}

function App() {
  return (
    <RepositoryContext.Provider value={repositories}>
      <MainFeedPage />
    </RepositoryContext.Provider>
  )
}

export default App
