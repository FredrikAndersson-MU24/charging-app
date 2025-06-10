import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import {ElectricMeter, EvStation, Paid} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import * as React from "react";

function NavBar() {
    const [value, setValue] = React.useState("/");

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const navigate = useNavigate();
    return (
        <BottomNavigation
            showLabels
            value={value}
            onChange={handleChange}
            sx={{
                bottom: 0,
                position: "fixed",
                width: "100vw",
                height: "4em",
                alignSelf: "center",
                margin: "0",
                backgroundColor: "lightblue",
            }}>
            <BottomNavigationAction onClick={() => navigate("/")} label="Charging" icon={<EvStation/>}/>
            <BottomNavigationAction  onClick={() => navigate("/price")} label="Price" icon={<Paid/>}/>
            <BottomNavigationAction onClick={() => navigate("/consumption")} label="Consumption" icon={<ElectricMeter/>}/>

        </BottomNavigation>
    )
}

export default NavBar;