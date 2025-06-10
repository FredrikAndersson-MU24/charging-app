import { memo } from "react";
import Chart from "react-apexcharts";

const PriceChart = (props:  { data: number[] })=> {
    const series = [{ data: props.data }];

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
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
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
                    return val + " öre/kWh"
                }
            }
        },
        yaxis: {
            title: {
                text: "Price (öre/kWh)",
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

export default memo(PriceChart)