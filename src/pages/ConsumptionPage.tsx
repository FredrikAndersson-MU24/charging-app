import {memo, useEffect, useState} from 'react'
import '../App.css'
import api from "../api/charging-station.tsx";
import ConsumptionChart from "../components/ConsumptionChart.tsx";
import {
    Refresh
} from "@mui/icons-material";

function ConsumptionPage() {

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
            <div className={"chart-container"}>
                <ConsumptionChart data={dailyConsumption}/>
                <button onClick={handleGetBaseLoad} className={"refresh-button"}><Refresh/></button>
            </div>
        </>
    )
}

export default memo(ConsumptionPage)
