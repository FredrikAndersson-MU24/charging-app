import {AccessTime, Bolt, ElectricCarOutlined, ElectricMeterOutlined,  PriceCheck} from "@mui/icons-material";
import {Chip} from "@mui/material";

const Chips = (props: {
    power: number | string,
    charge: number | string,
    charging: boolean,
    time: string,
    isCostOptimisedScheduled: boolean,
    isLoadOptimisedScheduled: boolean
}) => {

    return (
        <>
            <div className="chips-container" style={{display: "flex", justifyContent: "start"}}>
                <Chip icon={<AccessTime/>} label={props.time} variant="outlined" className={"chips"} color="info"/>
                <Chip icon={<Bolt/>} label={props.power + "kW"} variant="outlined" className={"chips"} color="info"/>
                <Chip icon={<ElectricCarOutlined/>} color={props.charging ? "success" : "info"}
                      label={props.charge + "%"} variant={props.charging ? "outlined" : "outlined"} className={"chips"}/>
                <Chip icon={<PriceCheck/>} sx={{
                    display: (props.isCostOptimisedScheduled ? "inline-block" : "none"),
                    width: '2.4em',
                    height: '2.4em',
                    '& .MuiChip-icon': {
                        alignSelf: 'center',
                        justifySelf: 'center',
                    }
                }} color={"success"}
                      variant={"outlined"}/>
                <Chip icon={<ElectricMeterOutlined/>} sx={{
                    display: (props.isLoadOptimisedScheduled ? "inline-block" : "none"),
                    width: '2.4em',
                    height: '2.4em',
                    '& .MuiChip-icon': {
                        alignSelf: 'center',
                        justifySelf: 'center',
                    }
                }}
                      color={"success"}
                variant={"outlined"}/>
            </div>
        </>

    )

}

export default Chips;