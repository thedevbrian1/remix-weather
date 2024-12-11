import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Search } from "~/icon";

export const meta: MetaFunction = () => {
  return [
    { title: "Weather app" },
    { name: "description", content: "Get current weather information" },
  ];
};

interface WeatherResponse {
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lat: number;
    lon: number;
  };
  dt: number;
  id: number;
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  sys: {
    country: string;
    id: number;
    sunrise: number;
    sunset: number;
    type: number;
  };
  timezone: number;
  visibility: number;
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  wind: {
    deg: number;
    speed: number;
  };
}

export async function loader() {
  let weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Kisumu&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
  );
  let weather: WeatherResponse = await weatherRes.json();

  return weather;
}

export default function Index() {
  let weather = useLoaderData<typeof loader>();
  console.log({ weather });

  let locations = ["Mombasa", "Tokyo", "Cairo", "Helsinki"];

  return (
    <main className="h-screen w-full bg-[url('https://images.unsplash.com/photo-1520259137323-f15f8cbaa61f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-no-repeat bg-center grid lg:grid-cols-5">
      <div className="lg:col-span-3 flex flex-col justify-between p-8 lg:pb-24">
        {/* Weather */}
        <h1>Weather</h1>
        <div className="flex gap-4 items-center">
          <span className="text-4xl lg:text-6xl font-semibold">16 &deg;</span>
          <span className="text-2xl">London</span>
          <span>Cloudy</span>
        </div>
      </div>
      <div className="backdrop-blur-md lg:col-span-2 px-4 lg:px-5">
        {/* Form & details */}
        <Form className="flex items-center mt-4">
          <input
            type="search"
            name="q"
            placeholder="Search location"
            aria-label="Search location"
            className="bg-transparent border border-gray-300 px-4 py-2 placeholder:text-gray-300"
          />
          <button type="submit" className="bg-orange-500 p-2 text-black">
            <Search />
          </button>
        </Form>
        <div className="mt-8">
          <h2 className="font-semibold">Locations</h2>
          <ul className="space-y-2 text-gray-300 mt-4">
            {locations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold">Weather details</h2>
          <ul className="mt-4 text-gray-300">
            {weather.weather.map((item) => (
              <li key={item.id}>{item.main}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
