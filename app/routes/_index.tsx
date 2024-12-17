import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { ErrorIcon, Search, ThreeDots } from "~/icon";

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

export async function loader({ request }: LoaderFunctionArgs) {
  let url = new URL(request.url);

  let searchParams = url.searchParams;

  let city = searchParams.get("q") || "Nairobi";

  // if (!city) {
  //   throw new Response("City name not found!", {
  //     status: 400,
  //     statusText: "Bad Request",
  //   });
  // }

  let weatherRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
  );
  let weather: WeatherResponse = await weatherRes.json();

  return weather;
}

export default function Index() {
  let weather = useLoaderData<typeof loader>();

  console.log({ weather });

  let [searchParams] = useSearchParams();
  let q = searchParams.get("q") || "";

  let navigation = useNavigation();

  let isSearching = Boolean(
    navigation.state === "loading" && navigation.location.search
  );

  let locations = ["Mombasa", "Tokyo", "Cairo", "Helsinki"];

  return (
    <main
      className={`h-screen w-full relative bg-[url('https://images.unsplash.com/photo-1520259137323-f15f8cbaa61f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-no-repeat bg-center grid lg:grid-cols-5`}
    >
      {/* Show pending UI */}
      {isSearching ? (
        <div className="w-full h-screen absolute inset-0 grid place-items-center bg-black/50">
          <span className="w-20">
            <ThreeDots />
          </span>
        </div>
      ) : null}

      <div className="lg:col-span-3 flex flex-col justify-between p-8 lg:pb-24">
        {/* Weather */}
        <h1>Weather</h1>
        <div className="flex gap-4 items-end">
          <span className="text-4xl lg:text-6xl font-semibold">
            {weather.main.temp} &deg;<span className="lg:text-4xl">C</span>
          </span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
            className="w-16"
          />
          <span>{weather.weather[0].main}</span>

          <span className="text-2xl">{weather.name}</span>
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
            defaultValue={q}
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
              <li key={index}>
                <Link to={`/?q=${item}`}>{item}</Link>
              </li>
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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.error(error);
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-60">
            <ErrorIcon />
          </div>
          <h1 className="text-3xl text-red-500">
            {error.status} {error.statusText}
          </h1>
          <p className="text-red-300">{error.data}</p>
          <Link
            to="."
            prefetch="intent"
            className="bg-white hover:bg-gray-300 transition ease-in-out duration-300 px-4 py-2 rounded-md text-black"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    console.error(error);
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-60">
            <ErrorIcon />
          </div>
          <h1 className="text-3xl text-red-500">Error</h1>
          <p className="text-red-300">{error.message}</p>
          <Link
            to="."
            prefetch="intent"
            className="bg-white hover:bg-gray-300 transition ease-in-out duration-300 px-4 py-2 rounded-md text-black"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
