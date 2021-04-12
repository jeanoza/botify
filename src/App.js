import { Chart } from "react-google-charts";
import axios from "axios";
import { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const api = axios.create({
  baseURL:
    "https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=SwPLIlNJuecT8HvelwbeyVBqq9uJAdfyClVjQLeM",
});

function App() {
  const [neoDataArray, setNeoDataArray] = useState([]);
  const [selectedArray, setSelectedArray] = useState([]);
  /**
   * for select a data : Earth, Juptr, Mars, Merc
   * I use neoDataArray for origin data, selectedArray for data which change by user click
   */
  useEffect(() => {
    api.get().then((response) => {
      const {
        data: { near_earth_objects },
      } = response;
      setNeoDataArray(near_earth_objects);
      setSelectedArray(near_earth_objects);
    });
  }, []);

  /**
   *
   *
   */
  const nameFilter = (data, name) =>
    data.close_approach_data
      .filter((data) => data.epoch_date_close_approach < Date.now())
      .reverse()[0].orbiting_body === name;
  const buttonHandle = (event) => {
    const {
      target: { outerText },
    } = event;
    const selected = neoDataArray.filter((neoData) =>
      nameFilter(neoData, outerText)
    );
    setSelectedArray(selected);
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Orbiting Body
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={buttonHandle}>Earth</Dropdown.Item>
          <Dropdown.Item onClick={buttonHandle}>Juptr</Dropdown.Item>
          <Dropdown.Item onClick={buttonHandle}>Mars</Dropdown.Item>
          <Dropdown.Item onClick={buttonHandle}>Merc</Dropdown.Item>
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
            ...selectedArray
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
