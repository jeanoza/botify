import { Chart } from "react-google-charts";
import axios from "axios";
import { useState, useEffect } from "react";

const api = axios.create({
  baseURL: "https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY",
});

function App() {
  const [neoDataArray, setNeoDataArray] = useState([]);
  useEffect(() => {
    api.get().then((response) => {
      const {
        data: { near_earth_objects },
      } = response;
      setNeoDataArray(near_earth_objects);
    });
  }, []);

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Orbiting Body
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Earth</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Juptr</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Mars</Dropdown.Item>
          <Dropdown.Item href="#/action-4">Merc</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div style={{ display: "flex", maxWidth: 900 }}>
        <Chart
          width={900}
          height={900}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={[
            [
              "NEO Name",
              "Min Estimated Diameter(km)",
              "Max Estimated Diameter",
            ],
            ...neoDataArray
              .sort(
                (a, b) =>
                  b.estimated_diameter.kilometers.estimated_diameter_min -
                  a.estimated_diameter.kilometers.estimated_diameter_min
              )
              .map((neoData) => {
                const id = neoData.id;
                const name = neoData.name;
                const max =
                  neoData.estimated_diameter.kilometers.estimated_diameter_max;
                const min =
                  neoData.estimated_diameter.kilometers.estimated_diameter_min;

                return [`${id} ${name.slice(name.indexOf("("))}`, min, max];
              }),
          ]}
          options={{
            chartArea: { width: "50%" },
            hAxis: {
              title: "Min Estimated Diameter(km)",
              minValue: 0,
            },
            vAxis: {
              title: "NEO Name",
            },
            legend: { position: "top" },
          }}
          legendToggle
        />
      </div>
    </>
  );
}

export default App;
