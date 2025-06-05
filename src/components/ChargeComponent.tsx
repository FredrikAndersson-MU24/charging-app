import Chart from "react-apexcharts";

export default function ChargeComponent(props: { data: number }) {
    const series = [props.data];

    const options = {
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#fff',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                        enabled: true,
                        top: 3,
                        left: 0,
                        blur: 4,
                        opacity: 0.25
                    }
                },
                track: {
                    background: '#f2f2f2',
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        offsetY: 5,
                        fontSize: '22px',
                    }
                }
            }
        },
        labels: ['Percent'],
    };

    return (
        <>
            <Chart options={options} series={series} type="radialBar"/>
            <p>{props.data  } kWh</p>
        </>
    );
}