import {useCallback, useEffect, useRef, useState} from 'react'
import '../App.css'
import api from "../api/charging-station.tsx";
import ChargeComponent from "../components/ChargeComponent.tsx";
import Chips from "../components/Chips.tsx";
interface Info {
    sim_time_hour: number;
    sim_time_min: number;
    base_current_load: number;
    battery_capacity_kWh: number;
    ev_battery_charge_start_stopp: boolean;
}

function ChargingPage() {
    const [charge, setCharge] = useState<number>(0);
    const [hour, setHour] = useState<number>(0);
    const [minute, setMinute] = useState<number>(0);
    const [load, setLoad] = useState<number>(0);
    const [info, setInfo] = useState<Info>();
    const [price, setPrice] = useState<Array<number>>([]);
    const [dailyConsumption, setDailyConsumption] = useState<Array<number>>([]);
    const [charging, setCharging] = useState<boolean>(false);
    const [chargeBelow80, setChargeBelow80,] = useState<boolean>(false);
    const [polling, setPolling,] = useState<boolean>(false);
    const chargerLoad: number = 7.4;
    const maxLoad: number = 11;
    const [isCostOptimisedScheduled, setIsIsCostOptimisedScheduled] = useState<boolean>(false);
    const [isLoadOptimisedScheduled, setIsLoadOptimisedScheduled] = useState<boolean>(false);
    const [abortCharge, setAbortCharge] = useState<boolean>(false);
    const [chargingHoursSorted, setChargingHoursSorted] = useState<Array<number>>([]);
    const pollingRate: number = 2000;
    const chargingTimeoutIdRef = useRef<number | null>(null);

    const pollTimeAndLoad = useCallback(() => {
        api.get(`/info`)
            .then((response) => {
                setTimeout(() => {
                    pollTimeAndLoad();
                    setHour(response.data.sim_time_hour);
                    setMinute(response.data.sim_time_min);
                    setLoad(response.data.base_current_load);
                }, 100)
            }).catch(error => {
            console.log(error);
        });
    },[])

    const handleStartChargeTo100 = (() => {
        api.post('/charge', {"charging": "on"})
            .then(() => {
                setCharging(true);
                checkChargeTo100();
            }).catch((error) => {
            console.log(error);
        })
    })

    const handleStartCharge = useCallback(() => {
        api.post('/charge', {"charging": "on"})
            .then(() => {
                console.log("LOG FROM HANDLESTARTCHARGE");
                setCharging(true);
            }).catch((error) => {
            console.log(error);
        })
    }, [])

    const handleStopCharge = useCallback(() => {
        if (chargingTimeoutIdRef.current) {
            clearTimeout(chargingTimeoutIdRef.current);
            chargingTimeoutIdRef.current = null;
        }
        api.post('/charge', {"charging": "off"})
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
                    chargingTimeoutIdRef.current = setTimeout(() => {                        checkChargeTo80();
                        setCharge(currentCharge);
                    }, pollingRate) as unknown as number;
                } else {
                    handleStopCharge();
                    console.log("Charge reached or exceeded 80. Stopping charge");
                    setCharge(currentCharge);
                }
            }).catch(error => {
            console.log(error);
        });
    }
    const currentHourRef = useRef(hour);
    const chargeRef = useRef(charge);
    const optimalHourRef = useRef(chargingHoursSorted);
    const isChargingRef = useRef(charging);
    const abortChargeRef = useRef(abortCharge);

    useEffect(() => {
        currentHourRef.current = hour;
        chargeRef.current = charge;
        optimalHourRef.current = chargingHoursSorted;
        isChargingRef.current = charging;
        abortChargeRef.current = abortCharge;
    }, [hour, charge, chargingHoursSorted, charging, abortCharge]);


    const checkChargeTo80PriceOptimised = (() => {
        if(!abortChargeRef.current){
            api.get(`/charge`)
                .then((response) => {
                    const currentCharge: number = response.data;
                    if (currentCharge > 79) {
                        handleAbortCharging();
                        console.log("Charge reached or exceeded 80. Stopping charge");
                        setCharge(currentCharge);
                    } else {
                        if (!optimalHourRef.current.includes(currentHourRef.current) && isChargingRef.current) {
                            handleStopCharge();
                            console.log("Not optimal hour. Charge stopped...");
                        } else if (!optimalHourRef.current.includes(currentHourRef.current) && !isChargingRef.current) {
                            console.log("Not optimal hour. Waiting.... ")
                        } else if (optimalHourRef.current.includes(currentHourRef.current) && isChargingRef.current) {
                            console.log("Optimal hour and charging already started. Charging....");
                        } else if (optimalHourRef.current.includes(currentHourRef.current) && !isChargingRef.current) {
                            handleStartCharge();
                            console.log("Optimal hour started. Charging started....");
                        }
                        chargingTimeoutIdRef.current = setTimeout(() => {
                            checkChargeTo80PriceOptimised();
                            setCharge(currentCharge);
                        }, pollingRate) as unknown as number;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log("Charging aborted by user, from checkChargeTo80PriceOptimised!");
        }
    });

    const checkChargeTo80LoadOptimised = (() => {
        if(!abortChargeRef.current){
            api.get(`/charge`)
                .then((response) => {
                    const currentCharge: number = response.data;
                    if (currentCharge > 79) {
                        handleAbortCharging();
                        console.log("Charge reached or exceeded 80. Stopping charge");
                        setCharge(currentCharge);
                    } else {
                        if (!optimalHourRef.current.includes(currentHourRef.current) && isChargingRef.current) {
                            handleStopCharge();
                            console.log("Not optimal hour. Charge stopped...");
                        } else if (!optimalHourRef.current.includes(currentHourRef.current) && !isChargingRef.current) {
                            console.log("Not optimal hour. Waiting.... ")
                        } else if (optimalHourRef.current.includes(currentHourRef.current) && isChargingRef.current) {
                            console.log("Optimal hour and charging already started. Charging....");
                        } else if (optimalHourRef.current.includes(currentHourRef.current) && !isChargingRef.current) {
                            handleStartCharge();
                            console.log("Optimal hour started. Charging started....");
                        }
                        chargingTimeoutIdRef.current = setTimeout(() => {
                            checkChargeTo80PriceOptimised();
                            setCharge(currentCharge);
                        }, pollingRate) as unknown as number;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log("Charging aborted by user, from checkChargeTo80LoadOptimised!");
        }
    });

    const handleAbortCharging = () => {
        setAbortCharge(true);
        if (chargingTimeoutIdRef.current) {
            clearTimeout(chargingTimeoutIdRef.current);
            chargingTimeoutIdRef.current = null;
        }
        handleStopCharge();
        setCharging(false);
        setIsIsCostOptimisedScheduled(false);
        setIsLoadOptimisedScheduled(false);
        setTimeout(()=>        setAbortCharge( false)
            , pollingRate + 50);
        console.log("Charging aborted by user, from handleAbortCharging!");
    }


    const checkChargeTo100 = () => {
        api.get(`/charge`)
            .then((response) => {
                const currentCharge: number = response.data;
                if (currentCharge < 99) {
                    chargingTimeoutIdRef.current = setTimeout(() => {                        checkChargeTo100();
                        setCharge(currentCharge);
                    }, pollingRate) as unknown as number;
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
        setAbortCharge(() => false);
        handleGetCharge();
        if (chargeBelow80) {
            const priceMap: Map<number, number> = new Map();
            for (let i = 0; i < price.length; i++) {
                priceMap.set(i, price[i]);
            }
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
            setIsIsCostOptimisedScheduled(true);
            checkChargeTo80LoadOptimised();
        } else {
            console.log("charge is already " + charge);
        }
    }

    const handleScheduleChargingWhenLowestLoad = () => {
        setAbortCharge(() => false);
        handleGetCharge();
        if (chargeBelow80) {
            const chargingHours: Array<number> = [];
            for(let i = 0; i < 4; i++){
                if (dailyConsumption[i] + chargerLoad < maxLoad) {
                    chargingHours.push(i);
                }
            }
            console.log("Charging hours: " + chargingHours);
            setChargingHoursSorted(chargingHours);
            setIsLoadOptimisedScheduled(true);
            checkChargeTo80PriceOptimised();
        } else {
            console.log("charge is already " + charge);
        }
    }


    const handleGetInfo = () => {
        api.get(`/info`)
            .then((response) => {
                setInfo(response.data);
            }).catch(error => {
            console.log(error);
        })
    }

    const handleGetCharge = () => {
        api.get(`/charge`)
            .then((response) => {
                console.log(response.data);
                setCharge(response.data);
                if (response.data < 79) {
                    setChargeBelow80(true);
                } else setChargeBelow80(false);
            }).catch(error => {
            console.log(error);
        });
    }

    const handleDischarge = () => {
        api.post('/discharge', {"discharging": "on"})
            .then(() => {
                console.log("Discharge request sent to API");
                handleGetCharge();
            }).catch((error) => {
            console.log(error);
        })
    }

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
        handleGetInfo();
        handleGetPrice();
        handleGetBaseLoad();
        handleGetCharge();
    }, []);

    useEffect(() => {
        if(!polling){
            pollTimeAndLoad();
            setPolling(true);
            console.log("SETTING POLLING")
        }
    }, [polling, pollTimeAndLoad]);

    return (
        <>
            <ChargeComponent data={charge} charging={charging}/>
            <button onClick={handleStartChargeTo100}
                    style={{backgroundColor: (charging ? "lightgreen" : "lightgrey")}}>Start
                Charge
            </button>
            <button onClick={handleChargeTo80} style={{backgroundColor: (charging ? "lightgreen" : "lightgrey")}}>Start
                Charge to 80%
            </button>
            <button onClick={handleAbortCharging}>Stop Charge</button>
            <button onClick={handleScheduleChargingWhenLowestPrice} style={{backgroundColor: (isCostOptimisedScheduled ? "lightgreen" : "lightgrey")}}>Charge when lowest price</button>
            <button onClick={handleScheduleChargingWhenLowestLoad} style={{backgroundColor: (isLoadOptimisedScheduled ? "lightgreen" : "lightgrey")}}>Charge when lowest load</button>
            <button onClick={handleDischarge}>Discharge</button>


        </>
    )
}

export default ChargingPage
