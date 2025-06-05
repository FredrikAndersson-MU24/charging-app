import {useEffect, useState} from 'react'
import './App.css'
import api from "./api/charging-station.tsx";
import PriceChart from "./components/PriceChart.tsx";
import ConsumptionChart from "./components/ConsumptionChart.tsx";
import ChargeComponent from "./components/ChargeComponent.tsx";


interface Info {
    sim_time_hour: number;
    sim_time_min: number;
    base_current_load: number;
    battery_capacity_kWh: number;
    ev_battery_charge_start_stopp: number;
}

function App() {
    const [charge, setCharge] = useState<number>(0);
    const [info, setInfo] = useState<Info>();
    const [price, setPrice] = useState<Array<number>>([]);
    const [dailyConsumption, setDailyConsumption] = useState<Array<number>>([]);

    const handleStartCharge = () => {
        api.post('/charge')
            .then((response) => {
                console.log(response);
            })
    }

    const handleGetInfo = () => {
        api.get(`/info`)
            .then((response) => {
                setInfo(response.data);
                console.log(response.headers.get);
            })
    }

    const handleGetCharge = () => {
        api.get(`/charge`)
            .then((response) => {
                setCharge(response.data);
                console.log(response.headers.get);
            }).catch (error=> {
            console.log(error);
        });
    }

    const handleGetDailyConsumption = () => {
        api.get(`/baseload`)
            .then((response) => {
                setDailyConsumption(response.data);
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
    useEffect(() => {
        handleGetInfo();
    }, []);

    useEffect(() => {
        handleGetCharge();
    }, [info]);

    return (
        <>
            <button onClick={handleGetPrice}>Get Price</button>
            <PriceChart data={price}/>
            <button onClick={handleGetDailyConsumption}>Get daily consumption</button>
            <ConsumptionChart data={dailyConsumption}/>
            <button onClick={handleStartCharge}>Start Charge</button>
            <ChargeComponent data={charge}/>
        </>
    )
}

export default App
