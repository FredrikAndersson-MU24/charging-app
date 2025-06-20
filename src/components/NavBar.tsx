import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import {ElectricMeter, EvStation, Paid} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {useState} from "react";

function NavBar() {
    const [value, setValue] = useState<string>("charging");

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
                backgroundColor: "#101a33",

            }}>
            <BottomNavigationAction
                onClick={() => navigate("/")}
                label="Charging"
                value="charging"
                icon={<EvStation/>}
                sx={{color: 'grey'}}/>
            <BottomNavigationAction
                onClick={() => navigate("/price")}
                label="Price"
                value="price"
                icon={<Paid/>}
                sx={{color: 'grey'}}/>
            <BottomNavigationAction
                onClick={() => navigate("/consumption")}
                label="Consumption"
                value="consumption"
                icon={<ElectricMeter/>}
                sx={{color: 'grey'}}/>

        </BottomNavigation>
    )
}

export default NavBar;