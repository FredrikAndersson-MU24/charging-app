import {useState} from 'react'
import './App.css'
import api from "./api/charging-station.tsx";
import PriceChart from "./components/PriceChart.tsx";


interface Info {
    sim_time_hour: number;
    sim_time_min: number;
    base_current_load: number;
    battery_capacity_kWh: number;
    ev_battery_charge_start_stopp: number;
}

function App() {

    const [info, setInfo] = useState<Info>();
    const [price, setPrice] = useState<Array<number>>([]);

    const handleGetCharge = () => {
        api.get(`/info`)
            .then((response) => {
                setInfo(response.data);
                console.log(response.data);
            })
    }

    const handleGetPrice = () => {
        setPrice([]);
        api.get(`/priceperhour`)
            .then((response) => {
                setPrice(response.data);
                console.log(response.data);
            })
    }

    return (
        <>
            <button onClick={handleGetCharge}>Get Charge</button>
            <p>{info ? info.battery_capacity_kWh : "No info"}</p>
            <button onClick={handleGetPrice}>Get Price</button>
            <PriceChart data={price}/>
        </>
    )
}

export default App
