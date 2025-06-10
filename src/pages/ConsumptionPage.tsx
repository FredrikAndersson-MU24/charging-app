import {useEffect, useState} from 'react'
import '../App.css'
import api from "../api/charging-station.tsx";
import ConsumptionChart from "../components/ConsumptionChart.tsx";


function App() {

    const [dailyConsumption, setDailyConsumption] = useState<Array<number>>([]);


    const handleGetBaseLoad = () => {
        setDailyConsumption([]);
        api.get(`/baseload`)
            .then((response) => {
                setDailyConsumption(response.data);
                console.log("Baseload fetched from API");
            }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        handleGetBaseLoad();
    }, []);

    return (
        <>
            <button onClick={handleGetBaseLoad}>Get daily consumption</button>
            <ConsumptionChart data={dailyConsumption}/>

        </>
    )
}

export default App
