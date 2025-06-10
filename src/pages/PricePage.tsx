import {useEffect, useState} from 'react'
import '../App.css'
import api from "../api/charging-station.tsx";
import PriceChart from "../components/PriceChart.tsx";

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

            <button onClick={handleGetPrice}>Get Price</button>
            <PriceChart data={price}/>


        </>
    )
}

export default PricePage
