import ReactApexChart from "react-apexcharts";
import {useState} from "react";
import type {ApexOptions} from "apexcharts";

const ChargeComponent = (props: { data: number, charging: boolean }) => {
    const charge = Number(props.data.toFixed(0));
    const series = [charge];
/*    const [series, setSeries] = useState([charge]);*/

    const [options] = useState<ApexOptions>({
        stroke: {
            lineCap: 'round',

        },
        plotOptions: {
            radialBar: {
                endAngle: 135,
                startAngle: -135,
                hollow: {
                    margin: 0,
                    size: '55%',
                    background: '#091124',
                    dropShadow: {
                        enabled: true,
                        top: 4,
                        left: 4,
                        blur: 4,
                        opacity: 0.4
                    }
                },
                track: {
                    dropShadow: {
                        enabled: true,
                        top: 4,
                        left: 4,
                        blur: 4,
                        opacity: 0.4
                    }
                },
                dataLabels: {
                    name: {
                        show: true,
                        offsetY: -20,
                        fontSize: '1.6em',
                        color: 'grey',
                    },
                    value: {
                        offsetY: 15,
                        fontSize: '2.4em',
                        color: 'grey',
                    },
                },
            },
        },
        labels: ['Charge'],
    });

    return (
        <>
            <div style={{marginBottom: "1.6em"}}>
                <ReactApexChart options={options} series={series} type="radialBar" />
            </div>

        </>
    );
}

export default ChargeComponent