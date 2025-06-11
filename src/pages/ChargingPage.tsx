import '../App.css'
import ChargeComponent from "../components/ChargeComponent.tsx";
import {Accordion, AccordionDetails, AccordionSummary, Chip, Typography} from "@mui/material";
import {
    Cancel,
    EvStation,
    ExpandMore
} from '@mui/icons-material';

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
                <div style={{display: "flex", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.25)", alignItems: "center", borderRadius: "3em"}}>
                    <Chip onClick={props.handleChargeTo80} icon={<EvStation/>} color={props.charging ? "success" : "primary"}
                              label={"Charge to 80%"} variant={props.charging ? "filled" : "filled"} sx={{margin: "0.3em"}}/>
                    <Chip onClick={props.handleAbortCharging} icon={<Cancel/>} color={props.charging ? "error" : "primary"}
                          label={"Stop Charge"} variant={props.charging ? "filled" : "filled"} sx={{margin: "0.3em"}}/>
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
