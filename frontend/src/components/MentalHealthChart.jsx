import { pieChart , Pie , Cell , Tooltop , Legend } from "recharts";

export default function MentalHealthChart({ chartData }){

    const COLORS = [ "#4ade80" , "#a3a3a3" , "#fbbf24" , "#f87171" , "#60a5fa" ];

    const data = Object.entries(chartData).map(([key , value]) => ({

        name: key,
        value,

    }));

    return(

        <div className="flex flex-col items-center mt-5">

            <h3 className="text-lg font-semibold mb-3">Your Mental Health Overview</h3>

            <PieChart width={350} height={300}>

                <Pie
                
                    data={data}
                    dataKey="value"
                    cx= "50%"
                    cy= "50%"
                    outerRadius={100}
                    label
            
                >

                    {data.map((entry , index) => (

                        <Cell key={index} fill={COLORS[index % COLORS.length]}/>

                    ))}

                </Pie>

                <Tooltip />

                <Legend />
                
            </PieChart>

        </div>


    );

}