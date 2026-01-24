import { Link } from "react-router-dom";

export default function ExploreEL() {
        
    return(
        <div className="relative w-full p-1 left-3/10">
           <ul className="tree w-full p-4 flex items-start flex-col gap-1 border-l">

                <li>
                    <Link to="" title="Everything">
                    🌌 Universe
                    </Link>
                </li>

                <li>
                    <Link to="" title="Bug Reports & Errors">
                    👾 Bugs
                    </Link>
                </li>

                <li>
                    <Link to="" title="Today I Learned">
                    🎒 TIL
                    </Link>
                </li>

                <li> 
                    <Link to="" title="Code Snippets & Demos">
                    💻 Snippets
                    </Link>
                </li>

                <li> 
                    <Link to="" title="Mini Tech Blogs">
                    ✍️ Mini Blog
                    </Link>
                </li>

                <li>
                    <Link to="" title="Workstation & Setup Showcase">
                    🖥️ Setup Showcase
                    </Link>
                </li>

                <li> 
                    <Link to="" title="Celebrations & Dev Wins">
                    🚀 Achievements
                    </Link>
                </li>

                <li> 
                    <Link to="" title="Tips, Tricks & Micro Skills">
                    ⚡ QuickTips
                    </Link>
                </li>

                <li>
                    <Link to="" title="Meme Zone for Devs">
                    🤖 Dev Memes
                    </Link>
                </li>

                <li>
                    <Link to="" title="Share Your Work-in-Progress">
                    🛠️ WIP
                    </Link>
                </li>

            </ul>

        </div>
    )
}