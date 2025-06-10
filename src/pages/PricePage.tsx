import {useEffect, useState} from 'react'
import '../App.css'
import api from "../api/charging-station.tsx";
import PriceChart from "../components/PriceChart.tsx";
import {Refresh} from "@mui/icons-material";

function PricePage() {
    const [price, setPrice] = useState<Array<number>>([]);

    const handleGetPrice = () => {
        setPrice([]);
        api.get(`/priceperhour`)
            .then((response) => {
                setPrice(response.data);
                console.log("Price fetched from API");
            }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        handleGetPrice();
    }, []);

    return (
        <>
        <div className={"chart-container"}>
            <PriceChart data={price}/>
            <button onClick={handleGetPrice} className={"refresh-button"}><Refresh/></button>
        </div>

        </>
    )
}

export default PricePage
