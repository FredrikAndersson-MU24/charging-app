import {useCallback, useEffect, useRef, useState} from 'react'
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
    const [hour, setHour] = useState<number>(0);
    const [minute, setMinute] = useState<number>(0);
    const [load, setLoad] = useState<number>(0);
    const [info, setInfo] = useState<Info>();
    const [price, setPrice] = useState<Array<number>>([]);
    const [dailyConsumption, setDailyConsumption] = useState<Array<number>>([]);
    const [charging, setCharging] = useState<boolean>(false);
    const [chargeBelow80, setChargeBelow80,] = useState<boolean>(false);
    const chargerLoad: number = 7.4;
    const maxLoad: number = 11;
    const [costOptimised, setCostOptimised] = useState<boolean>(false);
    const [abortCharge, setAbortCharge] = useState<boolean>(false);
    const [chargingHoursSorted, setChargingHoursSorted] = useState<Array<number>>([]);
    const pollingRate = 100;
    const checkTimeAndLoad = () => {
        api.get(`/info`)
            .then((response) => {
                setTimeout(() => {
                    checkTimeAndLoad();
                    setHour(response.data.sim_time_hour);
                    setMinute(response.data.sim_time_min);
                    setLoad(response.data.base_current_load);
                }, pollingRate)
            }).catch(error => {
            console.log(error);
        });
    }


    const handleStartChargeTo100 = (() => {
        api.post('/charge', {"charging": "on"}, {
          //  headers: {
          //      'Content-Type': 'application/json'
         //   }
        })
            .then(() => {
                setCharging(true);
                checkChargeTo100();
            }).catch((error) => {
            console.log(error);
        })
    })

    const handleStartCharge = useCallback(() => {
        api.post('/charge', {"charging": "on"}, {
         //   headers: {
         //       'Content-Type': 'application/json'
          //  }
        })
            .then(() => {
                console.log("LOG FROM HANDLESTARTCHARGE");
                setCharging(true);
            }).catch((error) => {
            console.log(error);
        })
    }, [])

    const handleStopCharge = useCallback(() => {
        api.post('/charge', {"charging": "off"}, {
       //     headers: {
       //         'Content-Type': 'application/json'
       //     }
        })
            .then(() => {
                console.log("LOG FROM HANDLESTOPCHARGE");
                setCharging(false);
            }).catch((error) => {
            console.log(error);
        })
        handleGetCharge();
    }, [])

    const checkChargeTo80 = () => {
        api.get(`/charge`)
            .then((response) => {
                const currentCharge: number = response.data;
                if (currentCharge < 79) {
                    setTimeout(() => {
                        checkChargeTo80();
                        setCharge(currentCharge);
                    }, pollingRate)
                } else {
                    handleStopCharge();
                    console.log("Charge reached or exceeded 80. Stopping charge");
                    setCharge(currentCharge);
                }
            }).catch(error => {
            console.log(error);
        });
    }
    const hourRef = useRef(hour);
    const chargeRef = useRef(charge);
    const optRef = useRef(chargingHoursSorted);
    const chargingRef = useRef(charging);
    const abortChargeRef = useRef(abortCharge);
    useEffect(() => {
        hourRef.current = hour;
        chargeRef.current = charge;
        optRef.current = chargingHoursSorted;
        chargingRef.current = charging;
        abortChargeRef.current = abortCharge;
    }, [hour, charge, chargingHoursSorted, charging,abortCharge]);


    const checkChargeTo80Optimised = (() => {
        if(!abortChargeRef.current){
            api.get(`/charge`)
                .then((response) => {
                    const currentCharge: number = response.data;
                    if (currentCharge > 79) {
                        handleStopCharge();
                        console.log("Charge reached or exceeded 80. Stopping charge");
                        setCharge(currentCharge);
                        setCostOptimised(false);
                        setCharging(false);
                    } else {
                        if (!optRef.current.includes(hourRef.current) && chargingRef.current) {
                            handleStopCharge();
                            console.log("Not optimal hour. Charge stopped...");
                        } else if (!optRef.current.includes(hourRef.current) && !chargingRef.current) {
                            console.log("Not optimal hour. Waiting.... ")
                        } else if (optRef.current.includes(hourRef.current) && chargingRef.current) {
                            console.log("Optimal hour. Charging....");
                        } else if (optRef.current.includes(hourRef.current) && !chargingRef.current) {
                            handleStartCharge();
                            console.log("Optimal hour started. Charging started....");
                        }
                        setTimeout(() => {
                            checkChargeTo80Optimised();
                            setCharge(currentCharge);
                        }, pollingRate);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log("Charging aborted by use from charge cycle!");
        }
    });

    const handleAbortCharging = () => {
        setAbortCharge(true);
        handleStopCharge();
        setCharging(false);
        setCostOptimised(false);
        setTimeout(()=>        setAbortCharge(false)
    , 1000)
        console.log("Charging aborted by user!");
    }


    const checkChargeTo100 = () => {
        api.get(`/charge`)
            .then((response) => {
                const currentCharge: number = response.data;
                if (currentCharge < 99) {
                    setTimeout(() => {
                        checkChargeTo100();
                        setCharge(currentCharge);
                    }, pollingRate)
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

    const handleScheduleChargingWhenLowestPrice = () => {
        setAbortCharge(false);
        handleGetCharge();
        if (chargeBelow80) {
            //Charging time from 20 to 80 % approx 4 hours
            const priceMap: Map<number, number> = new Map();
            for (let i = 0; i < price.length; i++) {
                priceMap.set(i, price[i]);
            }
            //sort the map on price ascending
            const priceMapSortedLowToHigh = new Map([...priceMap.entries()].sort((a, b) => a[1] - b[1]));

            const chargingHours: Array<number> = [];
            priceMapSortedLowToHigh.forEach((key: number, value: number) => {
                if (chargingHours.length < 4) {
                    if (dailyConsumption[value] + chargerLoad < maxLoad) {
                        chargingHours.push(value);
                    }
                }
                console.log("Charging hours: " + chargingHours);
            })
            const chargingHoursSorted1: Array<number> = chargingHours.sort((a, b) => a - b);
            setChargingHoursSorted(chargingHoursSorted1);
            setCostOptimised(true);
            checkChargeTo80Optimised();
        } else {
            console.log("charge is already " + charge);
        }
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
        handleGetPrice();
        handleGetDailyConsumption();
        handleGetCharge();
        checkTimeAndLoad();
    }, []);

    return (
        <>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <h2>{hour.toString().length == 2 ? hour : "0" + hour}:{minute.toString().length == 2 ? minute : "0" + minute}</h2>
                <h2>{load} kW</h2>
                <h2 style={{backgroundColor: (costOptimised ? "lightgreen" : "lightgrey")}}>{costOptimised ? "$" : ""}</h2>
                <h2>{hour.toString().length == 2 ? hour : "0" + hour}:{minute.toString().length == 2 ? minute : "0" + minute}</h2>

            </div>
            <ChargeComponent data={charge} charging={charging}/>
            <button onClick={handleStartChargeTo100}
                    style={{backgroundColor: (charging ? "lightgreen" : "lightgrey")}}>Start
                Charge
            </button>
            <button onClick={handleChargeTo80} style={{backgroundColor: (charging ? "lightgreen" : "lightgrey")}}>Start
                Charge to 80%
            </button>
            <button onClick={handleAbortCharging}>Stop Charge</button>
            <button onClick={handleScheduleChargingWhenLowestPrice}>Charge when lowest price</button>

            <button onClick={handleDischarge}>Discharge</button>
            <br/>
            <br/>
            <br/>
            <button onClick={handleGetPrice}>Get Price</button>
            <PriceChart data={price}/>
            <button onClick={handleGetDailyConsumption}>Get daily consumption</button>
            <ConsumptionChart data={dailyConsumption}/>

        </>
    )
}

export default App
