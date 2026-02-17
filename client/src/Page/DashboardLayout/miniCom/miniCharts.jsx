import {Chart as ChartJS,defaults} from 'chart.js/auto';
import { useEffect, useState } from 'react';
import {Doughnut,Line} from 'react-chartjs-2';
import axios from 'axios';
import {toast} from 'react-toastify'
import ProgressBar from './chartHelper/waitingOrProgress';

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
export default function ChartsEL() {
    const [postData,setPostData] = useState([]);
    const [helper,sethelper] = useState({ // this state is for holding the char till API is getting data
        waiting:true, 
        progress:0 // or user posts.count < 10
    });
    const [avrgPost,setAvg] = useState(0);

    const getChartData = async () => {
        try {
            let data = await axios.get("/myServer/readPost/getChartData");
            if (data.data.progress) {
                return sethelper(prev=>({
                    ...prev,
                    waiting:false,
                    progress:data.data.progress
                }));
            }

            setAvg(data.data.reduce((sum,p)=> sum + p.likes,0) / 10);
            setPostData(data.data)
           
        } catch (error) {
            toast.info(error.message)
        }
    }

    useEffect(()=>{
        getChartData();
    },[])

    const tempArray = [
        {
            label:"Like",
            value:99
        },
        {
            label:"comment",
            value:33
        },{
            label:"Save",
            value:66
        }
    ]
    


    return(
        <div className="underTaker gap-4 my-scroll bg-black/5 backdrop-blur-md flex-wrap">
            {postData.length < 10 ? (<ProgressBar date={helper} posts={postData}/>) : (<> <div className="lineChart flex-1 h-1/2">
                <Line
                    data={{
                        labels: postData.map((data, index) => index + 1),
                        datasets: [
                        {
                            label: "Recent 10 postData Stars chart",
                            data: postData.map(data => data.likes),
                            backgroundColor: "rgba(0, 255, 120, 0.9)",
                            borderColor: "rgba(0, 200, 90, 1)",
                        },
                        {
                            label: "Ideal Consistent Flow",
                            data: Array(postData.length).fill(avrgPost),
                            borderColor: "rgba(150,150,150,0.8)",
                            backgroundColor: "rgba(150,150,150,0.7)",
                            borderDash: [5, 5],
                            borderWidth: 2,
                            pointRadius: 0,
                            tension: 0.4
                        }
                        ]
                    }}
                    options={{
                        onClick: (event, elements) => {
                        if (!elements.length) return;

                        const index = elements[0].index;
                        const post = postData[index];

                        // 🔥 Open post (React Router example)
                        window.location.href = `/post/${post.post_id}`;
                        },

                        onHover: (event, elements) => {
                        event.native.target.style.cursor =
                            elements.length ? "pointer" : "default";
                        },

                        scales: {
                        x: {
                            grid: {
                            display: true,
                            color: "rgba(255,255,255,0.1)"
                            }
                        },
                        y: {
                            grid: {
                            display: true,
                            color: "rgba(255,255,255,0.1)"
                            }
                        }
                        },
                        elements: {
                        line: {
                            tension: 0.4
                        }
                        },
                        plugins: {
                        tooltip: {
                            callbacks: {
                            label: function (ctx) {
                                const post = postData[ctx.dataIndex];
                                return `${post.title}: ${post.likes} Stars`;
                            }
                            }
                        }
                        }
                    }}
                    />

            </div>
            <div className="doughnutChart flex-1 h-1/2 flex items-center">
                <Doughnut
                    data={{
                        labels:tempArray.map(data=>data.label),
                        datasets:[
                            {
                                label:"Count",
                                data:tempArray.map(data=>data.value),
                                  backgroundColor: [
                                    "rgba(0, 255, 163, 0.85)",   // Neon Mint
                                    "rgba(0, 136, 255, 0.85)",   // Electric Blue
                                    "rgba(255, 0, 220, 0.85)",   // Neon Pink
                                    ],

                                borderWidth:0
                            }
                        ]
                    }}
                    options={{
                        plugins:{
                            title:{
                                text:"Recent Post",
                                color:"rgba(255,255,0,0.9)",
                                font:{
                                    size:20,
                                    weight:'bold'
                                }
                            },
                        },
                    }}
                />
            </div> </>) }
        </div>
    )
}