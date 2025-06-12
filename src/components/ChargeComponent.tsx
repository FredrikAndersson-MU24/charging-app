import ReactApexChart from "react-apexcharts";
import {useState} from "react";
import type {ApexOptions} from "apexcharts";

const ChargeComponent = (props: { data: number, charging: boolean }) => {
    const charge = Number(props.data.toFixed(0));
    const series = [charge];
/*    const [series, setSeries] = useState([charge]);*/
    const gradientColors = ['#37f1f0', '#477ec1'];

    const [options] = useState<ApexOptions>({
        fill: { // <--- ADD THIS 'fill' PROPERTY FOR GRADIENT
            type: 'gradient',
            gradient: {
                shade: 'dark', // 'light' or 'dark'
                type: 'radial', // For radial bar, 'radial' often looks best, but 'horizontal' or 'vertical' also work
                shadeIntensity: 0.5,
                gradientToColors: gradientColors, // The end color(s) of the gradient
                inverseColors: false, // Set to true if you want to reverse the order of gradient colors
                opacityFrom: 1, // Starting opacity
                opacityTo: 1, // Ending opacity
                stops: [0, 100], // Stops for the gradient (0% and 100%)
            },
        },
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