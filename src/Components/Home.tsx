import { useEffect, useState } from "react";
import "../style.css";
import PendingIcon from "@mui/icons-material/Pending";
import SearchBox from "./SearchBox";
import Forecast from "./Forecast";

import { City, forecastType } from "../Extras/Types";

const Home: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  // const [city, setCity] = useState<optionType | null>(null);
  const [forecast, setForecast] = useState<forecastType | null>(null);

  useEffect(() => {
    fetchCities();
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  });

  const handleInfiniteScroll = async () => {
    try {
      //   console.log("InnerHeight:", window.innerHeight);
      //   console.log("TopHeight:", document.documentElement.scrollTop);
      //   console.log("ScrollHeight:", document.documentElement.scrollHeight);
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setLoading(false);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.log(err);
      <div>
        alert("There is an Error in the Scrolling Function of the Page")
      </div>;
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?where=population%20>%201000&limit=30&offset=${
          (page - 1) * 30
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();
      setCities((prev) => [...prev, ...data.results]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setLoading(false);
    }
  };

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const onSubmit = (city: City) => {
    if (!city) return;
    getForecast(city);
  };

  const getForecast = (data: City) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${data.coordinates.lat}&lon=${data.coordinates.lon}&units=metric&lang=en&appid=e62433a2d691fe7fbf7f944ce2c8bf34`
    )
      .then((res) => res.json())
      .then((data) => {
        const forecastData = {
          ...data.city,
          list: data.list.slice(0, 16),
        };

        setForecast(forecastData);
      })
      .catch((e) => console.log({ e }));
  };

  const renderRow = (city: City) => {
    return (
      <tr
        className="border-separate border border-slate-400 text-center text-neutral-700 row"
        // key={city.geoname_id}
      >
        <td className="py-1 m-1">
          <button onClick={() => onSubmit(city)}>{city.name}</button>
        </td>
        <td>{city.cou_name_en}</td>
        <td>{numberWithCommas(city.population)}</td>
        <td>{city.timezone}</td>
      </tr>
    );
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center my-8">CITY TABLE</h1>
      <div className="m-24">
        {forecast ? <Forecast data={forecast} /> : <SearchBox />}
      </div>
      {loading ? (
        <div>
          City Table Loading...
          <PendingIcon />
        </div>
      ) : cities && cities.length > 0 ? (
        <table className="table-auto border-collapse border border-slate-700 w-full font-sans">
          <caption className="caption-top text-sm text-slate-500">
            Click on the City rows to know there WEATHER FORECAST
          </caption>
          <thead>
            <tr className="text-center border-collapse border border-slate-900">
              <th className="py-1">City Name</th>
              <th>Country</th>
              <th>Population</th>
              <th>Timezone</th>
            </tr>
          </thead>
          <tbody>{cities.map((city) => renderRow(city))}</tbody>
        </table>
      ) : (
        <div>No cities to display</div>
      )}
    </div>
  );
};

export default Home;
