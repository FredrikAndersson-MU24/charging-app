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
    ev_battery_charge_start_stopp: boolean;
}

function App() {
    const [charge, setCharge] = useState<number>(0);
    const [info, setInfo] = useState<Info>();
    const [price, setPrice] = useState<Array<number>>([]);
    const [dailyConsumption, setDailyConsumption] = useState<Array<number>>([]);
    const [charging, setCharging] = useState<boolean>(false);
    const [chargeBelow80, setChargeBelow80,] = useState<boolean>(false);

    const checkTime = () => {
        api.get(`/info`)
            .then((response) => {
                const responseData = response.data;
                const currentHour: number = responseData.sim_time_hour;
                const currentMin: number = responseData.sim_time_min;
                const currentLoad: number = responseData.base_current_load;
                setTimeout(() => {
                    checkTime();
                    setHour(currentHour);
                    setMinute(currentMin);
                    setLoad(currentLoad);
                }, 500)
            }).catch(error => {
            console.log(error);
        });
    }

    const checkChargeTo80 = () => {
        api.get(`/charge`)
            .then((response) => {
                const currentCharge: number = response.data;
                if (currentCharge < 79) {
                    setTimeout(() => {
                        checkChargeTo80();
                        setCharge(currentCharge);
                    }, 100)
                } else {
                    handleStopCharge();
                    console.log("Charge reached or exceeded 80. Stopping charge");
                    setCharge(currentCharge);
                }
            }).catch(error => {
            console.log(error);
        });
    }

    const checkChargeTo100 = () => {
        api.get(`/charge`)
            .then((response) => {
                const currentCharge: number = response.data;
                if (currentCharge < 99) {
                    setTimeout(() => {
                        checkChargeTo100();
                        setCharge(currentCharge);
                    }, 100)
                } else {
                    handleStopCharge();
                    console.log("Charge reached or exceeded 100. Stopping charge");
                    setCharge(currentCharge);
                }
            }).catch(error => {
            console.log(error);
        });
    }

    const handleChargeTo80 = () => {
        handleGetCharge();
        if (chargeBelow80) {
            console.log("Charge is " + charge + ". Charging to 80");
            api.post('/charge', {"charging": "on"}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    console.log(response);
                    setCharging(true);
                    checkChargeTo80();
                }).catch((error) => {
                console.log(error);
            })
            console.log("charging started!");
        } else {
            console.log("charge is already " + charge);
        }

    }

    const handleStartCharge = () => {
        api.post('/charge', {"charging": "on"}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                setCharging(true);
                checkChargeTo100();
            }).catch((error) => {
            console.log(error);
        })
    }

    const handleStopCharge = () => {
        api.post('/charge', {"charging": "off"}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                setCharging(false);
                handleGetCharge();
            }).catch((error) => {
            console.log(error);
        })
    }

    const handleGetInfo = () => {
        api.get(`/info`)
            .then((response) => {
                setInfo(response.data);
            })
    }

    const handleGetCharge = () => {
        api.get(`/charge`)
            .then((response) => {
                console.log(response.data);
                setCharge(response.data);
                if (response.data < 80) {
                    setChargeBelow80(true);
                }
            }).catch(error => {
            console.log(error);
        });
    }

    const handleDischarge = () => {
        api.post('/discharge', {"discharging": "on"}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                handleGetCharge();
            }).catch((error) => {
            console.log(error);
        })
    }

    const handleGetDailyConsumption = () => {
        setDailyConsumption([]);
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
        handleGetCharge();

    }, []);

    useEffect(() => {
        checkTime();
    }, [checkTime, info]);

    return (
        <><div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <h2 >{hour.toString().length == 2 ? hour : "0"+hour}:{minute.toString().length == 2 ? minute : "0" + minute}</h2>
            <h2 >{load} kW</h2>
            <h2 >{hour.toString().length == 2 ? hour : "0"+hour}:{minute.toString().length == 2 ? minute : "0" + minute}</h2>

        </div>
            <ChargeComponent data={charge} charging={charging}/>
            <button onClick={handleStartCharge} style={{backgroundColor: (charging ? "lightgreen" : "lightgrey")}}>Start
                Charge
            </button>
            <button onClick={handleChargeTo80} style={{backgroundColor: (charging ? "lightgreen" : "lightgrey")}}>Start
                Charge to 80%
            </button>
            <button onClick={handleStopCharge}>Stop Charge</button>

            <button onClick={handleDischarge}>Discharge</button>
            <br/>
            <br/>
            <br/>
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
