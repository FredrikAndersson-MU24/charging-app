import {memo, useEffect, useState} from 'react'
import '../App.css'
import api from "../api/charging-station.tsx";
import ConsumptionChart from "../components/ConsumptionChart.tsx";
import {
    Refresh
} from "@mui/icons-material";
import {Chip} from "@mui/material";

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
                <Chip onClick={handleGetBaseLoad} icon={<Refresh/>} sx={{
                    width: '2.4em',
                    height: '2.4em',
                    '& .MuiChip-icon': {
                        alignSelf: 'center',
                        justifySelf: 'center',
                    }
                }}
                      className={"refresh-button"}/>
            </div>
        </>
    )
}

export default memo(ConsumptionPage)
