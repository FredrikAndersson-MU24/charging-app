import '../App.css'
import ChargeComponent from "../components/ChargeComponent.tsx";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import {ExpandMore} from '@mui/icons-material';

const ChargingPage = (props: {
    charge: number,
    charging: boolean,
    isCostOptimisedScheduled: boolean,
    isLoadOptimisedScheduled: boolean,
    handleScheduleChargingWhenLowestLoad(): void,
    handleScheduleChargingWhenLowestPrice(): void,
    handleDischarge(): void,
    handleAbortCharging(): void,
    handleChargeTo80(): void,
    handleStartChargeTo100(): void,

}) => {


    return (
        <>
            <div className={"charge-container"}>
                <ChargeComponent data={props.charge} charging={props.charging}/>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <button onClick={props.handleChargeTo80}
                            style={{backgroundColor: (props.charging ? "lightgreen" : "")}}
                            className={"charging-button"}>
                        Charge to 80%
                    </button>
                    <button onClick={props.handleAbortCharging}
                            className={"charging-button"}>
                        Stop Charge
                    </button>
                </div>
            </div>

            <div className={"schedule-container"}>
                    <Accordion
                        sx={{backgroundColor: "#14263e", color: 'gray', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',}}>
                        <AccordionSummary expandIcon={<ExpandMore/>}>
                            <Typography component="span">Scheduling</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className={"accordion-details"}>
                                <button onClick={() => {
                                    props.handleScheduleChargingWhenLowestPrice()
                                }}
                                        style={{backgroundColor: (props.isCostOptimisedScheduled ? "lightgreen" : "")}}
                                        className={"charging-button"}>
                                    Charge when lowest price
                                </button>
                                <button onClick={props.handleScheduleChargingWhenLowestLoad}
                                        style={{backgroundColor: (props.isLoadOptimisedScheduled ? "lightgreen" : "")}}
                                        className={"charging-button"}>
                                    Charge when lowest load
                                </button>
                            </div>

                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        sx={{backgroundColor: "#14263e", color: 'gray', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',}}>
                        <AccordionSummary expandIcon={<ExpandMore/>}>
                            <Typography component="span">Special functions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className={"accordion-details"}>
                                <button onClick={props.handleStartChargeTo100}
                                        style={{backgroundColor: (props.charging ? "lightgreen" : "")}}
                                        className={"charging-button"}>
                                    Start Charge to 100%
                                </button>
                                <button onClick={props.handleDischarge} className={"charging-button"}>Discharge</button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
            </div>


        </>
    )
}

export default ChargingPage
