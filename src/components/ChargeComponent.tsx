import Chart from "react-apexcharts";

const ChargeComponent = (props: { data: number, charging: boolean })=> {
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
                    background: "opaque",
                    backgroundColor: "#24292e",
                    dropShadow: {
                        enabled: true,
                        top: -15,
                        left: 0,
                        blur: 4,
                        opacity: 0.4
                    }
                },
                track: {
                    background: "#f2f2f2",
                    radius: 5,
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
                        color: 'gray',
                    }
                }
            }
        },
        labels: ['Charge'],
    };

    return (
        <>
            <div>
                <Chart options={options} series={series} type="radialBar"/>
            </div>

        </>
    );
}

export default ChargeComponent