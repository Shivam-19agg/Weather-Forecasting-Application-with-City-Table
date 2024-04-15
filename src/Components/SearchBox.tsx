import Forecast from './Forecast'
import SearchBar from './SearchBar'

import useForecast from '../Hooks/useForecast'

const App = (): JSX.Element => {
  const { forecast, options, term, onOptionSelect, onSubmit, onInputChange } = useForecast();

  return (
    <main className="flex justify-center items-center bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400 h-[100vh] w-full">
      {forecast ? (
        <Forecast data={forecast} />
      ) : 
      (
        <SearchBar
          term={term}
          options={options}
          onInputChange={onInputChange}
          onOptionSelect={onOptionSelect}
          onSubmit={onSubmit}
        />
      )
      }
    </main>
  )
}

export default App