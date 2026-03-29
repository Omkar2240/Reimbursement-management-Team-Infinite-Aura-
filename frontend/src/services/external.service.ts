import axios from "axios"

export type CountryData = {
  name: { common: string }
  currencies?: Record<string, { name: string; symbol: string }>
}

export const getCountriesAndCurrencies = async () => {
  const res = await axios.get<CountryData[]>("https://restcountries.com/v3.1/all?fields=name,currencies")
  
  const data = res.data.map(c => ({
    name: c.name.common,
    currencies: c.currencies ? Object.keys(c.currencies) : []
  }))
  
  // sort alphabetically
  data.sort((a, b) => a.name.localeCompare(b.name))

  // extract unique currency
  const uniqueCurrencies = Array.from(new Set(data.flatMap(d => d.currencies)))
  uniqueCurrencies.sort()
  
  return { countries: data, currencies: uniqueCurrencies }
}