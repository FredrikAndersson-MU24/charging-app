import {memo, useCallback, useEffect, useRef, useState} from 'react'
import './App.css'
import api from "./api/charging-station.tsx";
import {
    Route, Routes
} from 'react-router-dom';
import PricePage from "./pages/PricePage.tsx";
import ConsumptionPage from "./pages/ConsumptionPage.tsx";
import ChargingPage from "./pages/ChargingPage.tsx";
import NavBar from "./components/NavBar.tsx";
import Chips from "./components/Chips.tsx";

function App() {
    const [charge, setCharge] = useState<number>(0);
    const [hour, setHour] = useState<number>(0);
    const [minute, setMinute] = useState<number>(0);
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
    const pollingRate: number = 100;
    const chargingTimeoutIdRef = useRef<number | null>(null);
    const currentHourRef = useRef(hour);
    const chargeRef = useRef(charge);
    const optimalHourRef = useRef(chargingHoursSorted);
    const isChargingRef = useRef(charging);
    const abortChargeRef = useRef(abortCharge);

    const pollTimeAndLoad = useCallback(() => {
            api.get(`/info`)
                .then((response) => {
                    setTimeout(() => {
                        pollTimeAndLoad();
                        setHour(response.data.sim_time_hour);
                        setMinute(response.data.sim_time_min);
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

    const handleStopCharge = async () => {
        if (chargingTimeoutIdRef.current) {
            clearTimeout(chargingTimeoutIdRef.current);
            chargingTimeoutIdRef.current = null;
        }

        try {
            await api.post('/charge', { charging: "off" });
            console.log("LOG FROM HANDLESTOPCHARGE");
            setCharging(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAbortCharging = async () => {
        setAbortCharge(()=>true);
        console.log(chargingTimeoutIdRef.current);
        if (chargingTimeoutIdRef.current) {
            clearTimeout(chargingTimeoutIdRef.current);
            chargingTimeoutIdRef.current = null;
        }
        await handleStopCharge();
        setCharging(false);
        setIsIsCostOptimisedScheduled(false);
        setIsLoadOptimisedScheduled(false);
        setTimeout(()=> setAbortCharge(false)
            , pollingRate + 200);
        console.log("Charging aborted by user, from handleAbortCharging!");
    }

    const checkChargeTo80 = () => {
        api.get(`/charge`)
            .then(async (response) => {
                const currentCharge: number = response.data;
                if (currentCharge < 79) {
                    chargingTimeoutIdRef.current = setTimeout(() => {                        checkChargeTo80();
                        setCharge(currentCharge);
                    }, pollingRate) as unknown as number;
                } else {
                    await handleStopCharge();
                    console.log("Charge reached or exceeded 80. Stopping charge");
                    setCharge(currentCharge);
                }
            }).catch(error => {
            console.log(error);
        });
    }

    const checkChargeTo80PriceOptimised = (() => {
        if(!abortChargeRef.current){
            api.get(`/charge`)
                .then(async (response) => {
                    const currentCharge: number = response.data;
                    if (currentCharge > 79) {
                        await handleAbortCharging();
                        console.log("Charge reached or exceeded 80. Stopping charge");
                        setCharge(currentCharge);
                    } else {
                        if (!optimalHourRef.current.includes(currentHourRef.current) && isChargingRef.current) {
                            await handleStopCharge();
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
                .then(async (response) => {
                    const currentCharge: number = response.data;
                    if (currentCharge > 79) {
                        await handleAbortCharging();
                        console.log("Charge reached or exceeded 80. Stopping charge");
                        setCharge(currentCharge);
                    } else {
                        if (!optimalHourRef.current.includes(currentHourRef.current) && isChargingRef.current) {
                            await handleStopCharge();
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

    const checkChargeTo100 = () => {
        api.get(`/charge`)
            .then(async (response) => {
                const currentCharge: number = response.data;
                if (currentCharge < 99) {
                    chargingTimeoutIdRef.current = setTimeout(() => {
                        checkChargeTo100();
                        setCharge(currentCharge);
                    }, pollingRate) as unknown as number;
                } else {
                    await handleStopCharge();
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
            priceMapSortedLowToHigh.forEach((_key: number, value: number) => {
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
        if (abortCharge) {
            console.log("AbortCharge is now true");
        } else {
            console.log("AbortCharge is now false");
        }
    }, [abortCharge]);

    useEffect(() => {
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

    useEffect(() => {
        currentHourRef.current = hour;
        chargeRef.current = charge;
        optimalHourRef.current = chargingHoursSorted;
        isChargingRef.current = charging;
        abortChargeRef.current = abortCharge;
    }, [hour, charge, chargingHoursSorted, charging, abortCharge]);

    return (
        <>
            <div className="app-container">
                <Chips
                    power={(charging ? (dailyConsumption[currentHourRef.current] + chargerLoad).toFixed(2) : dailyConsumption[currentHourRef.current])}
                    charge={charge.toFixed()}
                    charging={charging}
                    time={(hour.toString().length == 2 ? hour : "0" + hour)+":"+(minute.toString().length == 2 ? minute : "0" + minute)}
                    isCostOptimisedScheduled={isCostOptimisedScheduled}
                    isLoadOptimisedScheduled={isLoadOptimisedScheduled}/>
                <div className="page-container">
                    <Routes>
                        <Route path="/" element={<ChargingPage
                            charge={charge}
                            charging={charging}
                            optimalHours={chargingHoursSorted}
                            handleScheduleChargingWhenLowestLoad={handleScheduleChargingWhenLowestLoad}
                            isCostOptimisedScheduled={isCostOptimisedScheduled}
                            isLoadOptimisedScheduled={isLoadOptimisedScheduled}
                            handleScheduleChargingWhenLowestPrice={handleScheduleChargingWhenLowestPrice}
                            handleDischarge={handleDischarge}
                            handleAbortCharging={handleAbortCharging}
                            handleChargeTo80={handleChargeTo80}
                            handleStartChargeTo100={handleStartChargeTo100}/>}/>
                        <Route path="/consumption" element={<ConsumptionPage/>}/>
                        <Route path="/price" element={<PricePage/>}/>
                    </Routes>
                </div>
                <NavBar/>
            </div>
        </>
    )
}

export default memo(App)
