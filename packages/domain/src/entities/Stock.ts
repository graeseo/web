export type StockKey = 'tsla' | 'pltr'

export interface Stock {
  key: StockKey
  ticker: string
  name: string
  priceUSD: number
  changePercent: number
}
