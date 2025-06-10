import Chart from "react-apexcharts";
import {memo} from "react";

const ConsumptionChart = (props:  { data: number[]}) => {
    const consumption: number[] = props.data;
    const series=  [{data: consumption}];

    const options = {
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: "80%",
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "vertical",
                shadeIntensity: 0.5,
                gradientToColors: ['#37f1f0'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 300],
                colorStops: [
                    {
                        offset: 0,
                        color: '#37f1f0',
                        opacity: 1,
                    },
                    {
                        offset: 80,
                        color: '#477ec1',
                        opacity: 1,
                    },
                ],
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['00', ' ', ' ', ' ', ' ', ' ', '06', ' ', ' ', '', ' ', ' ', '12', ' ', ' ', ' ', ' ', ' ', '18', ' ', ' ', ' ', ' ', '23'],
            labels: {
                style: {
                    colors: "#787878",
                    fontSize: "12px",
                },
            },
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return val + " kWh"
                }
            }
        },
        yaxis: {
            title: {
                text: 'Consumption (kWh)',
                style: {
                    color: "#787878",
                },
            },
            labels: {
                style: {
                    colors: "#787878",
                    fontSize: "12px",
                },
            },
        },
        style: {
            fontSize: "12px",
        },
    };

    return (
        <div className="column">
            <Chart options={options} series={series} type="bar" />
        </div>
    );
}

export default memo(ConsumptionChart);