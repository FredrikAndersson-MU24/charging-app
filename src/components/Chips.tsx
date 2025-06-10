import {AccessTime, ElectricMeterOutlined, Power, PriceCheck} from "@mui/icons-material";
import {Chip} from "@mui/material";




const Chips = (props: {
    power: number |string,
    time: string,
    isCostOptimisedScheduled: boolean,
    isLoadOptimisedScheduled: boolean
}) => {

    return (
        <>
            <div className="chips" style={{display: "flex", justifyContent: "space-between"}}>

                <Chip icon={<AccessTime />} label={props.time} variant="outlined"/>
                <Chip icon={<PriceCheck/>} sx={{display: (props.isCostOptimisedScheduled ? "inline-block" : "none")}} variant="outlined" />
                <Chip icon={<ElectricMeterOutlined/>} sx={{display: (props.isLoadOptimisedScheduled ? "inline-block" : "none")}} variant="outlined" />
                <Chip icon={<Power />} label={props.power} variant="outlined" />

            </div>
                </>

    )

}

export default Chips;