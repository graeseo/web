export type StockKey = 'tsla' | 'pltr'

export interface Stock {
  key: StockKey
  ticker: string
  name: string
  mark: string
  priceUSD: number
  changePercent: number
}
