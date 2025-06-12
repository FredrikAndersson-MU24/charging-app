import '../App.css'
import ChargeComponent from "../components/ChargeComponent.tsx";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle, List, ListItem,
    Typography
} from "@mui/material";
import {
    Bolt,
    Cancel, CancelOutlined,
    EvStation,
    ExpandMore,
} from '@mui/icons-material';
import {useState} from "react";

const ChargingPage = (props: {
    charge: number,
    charging: boolean,
    optimalHours: number[],
    isCostOptimisedScheduled: boolean,
    isLoadOptimisedScheduled: boolean,
    handleScheduleChargingWhenLowestLoad(): void,
    handleScheduleChargingWhenLowestPrice(): void,
    handleDischarge(): void,
    handleAbortCharging(): void,
    handleChargeTo80(): void,
    handleStartChargeTo100(): void,

}) => {

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    return (
        <>
            <div className={"charge-container"}>
                <div style={{display: "flex", justifyContent: "space-between", background: (props.isCostOptimisedScheduled || props.isLoadOptimisedScheduled   ? "rgba(255, 255, 255, 0.25)" : " "), alignItems: "center", borderRadius: "3em", minHeight: "2em", height: "auto"}}>
                    <Chip icon={<Bolt/>}
                          label={("Cost optimised charging scheduled for hours:" + props.optimalHours.map(item => {
                              return (
                              (item.toString().length == 1 ? " 0" + item.toString() + "" : " " + item.toString() + "")
                              )
                          }))}
                          sx={{
                              display: (props.isCostOptimisedScheduled   ? "flex" : "none"),
                              flexDirection: "row",
                              height: 'auto',
                              '& .MuiChip-label': {
                                  display: 'block',
                                  whiteSpace: 'normal',
                                  color: 'white',
                                  margin: '0.2em'
                              },
                              '& .MuiChip-icon': {
                                  color: 'yellow',
                                  alignSelf: 'center',
                              },
                          }}/>
                    <Chip icon={<Bolt/>}
                          label={("Cost optimised charging scheduled for hours:" + props.optimalHours.map(item => {
                              return (
                                  (item.toString().length == 1 ? " 0" + item.toString() + "" : " " + item.toString() + "")
                              )
                          }))}
                          sx={{
                              display: (props.isLoadOptimisedScheduled   ? "flex" : "none"),
                              flexDirection: "row",
                              height: 'auto',
                              '& .MuiChip-label': {
                                  display: 'block',
                                  whiteSpace: 'normal',
                                  color: 'white',
                                  margin: '0.2em'
                              },
                              '& .MuiChip-icon': {
                                  color: 'yellow',
                                  alignSelf: 'center',
                              },
                          }}/>
                </div>

                <ChargeComponent data={props.charge} charging={props.charging}/>
                <div style={{display: "flex", justifyContent: "space-between", background: "rgba(255, 255, 255, 0.35)", alignItems: "center", borderRadius: "3em"}}>
                    <Chip onClick={()=>handleOpenDialog()} icon={<EvStation/>} color={props.charging ? "success" : "primary"}
                              label={"Schedule charge"} variant={props.charging ? "filled" : "outlined"} sx={{margin: "0.3em"}}/>
                    <Chip onClick={props.handleAbortCharging} icon={<Cancel/>} color={props.charging ? "error" : "primary"}
                          label={"Stop Charge"} variant={props.charging ? "filled" : "outlined"} sx={{margin: "0.3em"}}/>
                </div>
            </div>

            <div className={"schedule-container"}>
                    <Accordion
                        sx={{backgroundColor: "#14263e", color: 'gray', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',}}>
                        <AccordionSummary expandIcon={<ExpandMore/>}>
                            <Typography component="span">Test functions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className={"accordion-details"}>

                                <Chip onClick={props.handleDischarge} variant={"outlined"} color={"info"} label={"Discharge"}/>
                                <Chip onClick={props.handleChargeTo80} color={props.charging ? "success" : "info"}
                                      label={"Charge to 80%"} variant={props.charging ? "outlined" : "outlined"} />
                                <Chip onClick={props.handleStartChargeTo100}
                                      variant={"outlined"} color={"info"}
                                      label={"Charge to 100%"}/>
                            </div>
                        </AccordionDetails>
                    </Accordion>
            </div>
            <Dialog open={openDialog} sx={{
                padding: "1em",
                marginLeft: "auto",
                marginRight: "auto",
/*                bottom: "-60%",*/
                position: "absolute",
                backgroundColor: "rgba(255, 255, 255, 0.35)"
            }}>
            <div style={{display: "flex", justifyContent: "space-between",backgroundColor: "#14263e"}}>
                <DialogTitle sx={{backgroundColor: "#14263e", color: "lightgrey"}}><Bolt/> Schedule charging </DialogTitle>
                    <CancelOutlined sx={{backgroundColor: "#14263e", color: "lightgrey", padding: "0.1em"}} onClick={handleCloseDialog}/>
            </div>

                <DialogContent sx={{backgroundColor: "#14263e", color: "lightgrey"}}>Choose your charging strategy.</DialogContent>
                <List sx={{backgroundColor: "#14263e", color: "white", display: "flex", flexDirection: "column", alignItems: "center", }}>

                    <ListItem sx={{display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#14263e",}} >
                        <Chip onClick={() => {
                                if(!props.charging && !props.isLoadOptimisedScheduled ) {
                                    {props.handleScheduleChargingWhenLowestPrice()}
                                handleCloseDialog()}}
                                }
                                sx={{backgroundColor: (props.isCostOptimisedScheduled ? "lightgreen" : "")}} color={props.charging ? "success" : "primary"} variant={"filled"} label={"Charge when lowest price "}/>

                    </ListItem>

                    <ListItem sx={{display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#14263e",}} >
                        <Chip onClick={() => {
                            if(!props.charging && !props.isCostOptimisedScheduled ) {
                            {
                                props.handleScheduleChargingWhenLowestLoad()
                            }
                            handleCloseDialog()
                        }}}
                              sx={{backgroundColor: (props.isLoadOptimisedScheduled ? "lightgreen" : "")}} color={props.charging ? "success" : "primary"} variant={"filled"} label={"Charge when lowest load "}/>
                    </ListItem>
                </List>

            </Dialog>

        </>
    )
}

export default ChargingPage
