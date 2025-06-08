import Chart from "react-apexcharts";

export default function ChargeComponent(props: { data: number, charging: boolean }) {
    const charge = Number(props.data.toFixed(0));
    const series = [charge];

    const options = {
        plotOptions: {
            radialBar: {
                endAngle: 135,
                startAngle: -135,
                hollow: {
                    margin: 0,
                    size: '60%',
                    background: "transparent",
                    dropShadow: {
                        enabled: true,
                        top: 5,
                        left: 0,
                        blur: 4,
                        opacity: 0.25
                    }
                },
                track: {
                    background: "#f2f2f2",
                },
                dataLabels: {
                    name: {
                        show: true,
                        offsetY: -20,
                        fontSize: '1.6em',

                    },
                    value: {
                        offsetY: 15,
                        fontSize: '3em',
                    }
                }
            }
        },
        labels: ['Charge'],
    };

    return (
        <>
            <Chart options={options} series={series} type="radialBar"/>
        </>
    );
}