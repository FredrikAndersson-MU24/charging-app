import Chart from "react-apexcharts";
import {memo} from "react";

const ConsumptionChart = (props:  { data: number[]}) => {
    const consumption: number[] = props.data;
    const series=  [{data: consumption}];

    const options = {
        dataLabels: { enabled: false },
        xaxis: {
            categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
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
                text: 'Consumption (kWh)'
            }
        },
    };

    return (
        <div className="column">
            <Chart options={options} series={series} type="bar" />
        </div>
    );
}

export default memo(ConsumptionChart);