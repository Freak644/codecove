import {Chart as ChartJS,defaults} from 'chart.js/auto';
import { rgba } from 'framer-motion';
import {Doughnut,Line} from 'react-chartjs-2';

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
export default function ChartsEL() {
    const tempArray = [
        {
            label:"Like",
            value:99
        },
        {
            label:"comment",
            value:33
        },{
            label:"share",
            value:66
        }
    ]
    const posts = [
        { title: "Exploring the Night Sky", likes: 57 },
        { title: "My First JavaScript App", likes: 38 },
        { title: "Morning Coffee Vibes", likes: 92 },
        { title: "A Walk in the Forest", likes: 44 },
        { title: "Learning React Hooks", likes: 71 },
        { title: "Sunset at the Beach", likes: 63 },
        { title: "Building a Node API", likes: 28 },
        { title: "Weekend Chill Moments", likes: 86 },
        { title: "Dark Mode UI Design", likes: 49 },
        { title: "Simple Pasta Recipe", likes: 77 }
        ];
    
        const avrgPost = posts.reduce((sum,p)=> sum + p.likes,0) / posts.length;

    return(
        <div className="underTaker gap-4 border border-amber-300 my-scroll">
            <div className="lineChart flex-1 h-1/2">
                <Line 
                    data={{
                        labels:posts.map((data,index)=>index+1),

                        datasets:[
                            {
                                label:"Recent 10 Posts Stars chart",
                                data:posts.map(data=>data.likes),
                               backgroundColor: "rgba(0, 255, 120, 0.9)",
                                borderColor: "rgba(0, 200, 90, 1)",

                            },
                            {
                                label:"Ideal Consistent Flow",
                                data:Array(posts.length).fill(avrgPost),
                                borderColor:"rgba(150,150,150,0.8)",
                                backgroundColor:"rgba(150,150,150,0.7)",
                                borderDash:[5,5],
                                borderWidth:2,
                                pointRadius:0,
                                tension:0.4
                            }
                        ]
                    }}
                    options={{
                        elements:{
                            line:{
                                tension:0.5
                            }
                        },
                        plugins:{
                            tooltip:{
                                callbacks:{
                                    label:function (ctx) {
                                        const post = posts[ctx.dataIndex];
                                        return `${post.title}: ${post.likes} Stars`
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
            </div>
        </div>
    )
}