import ImageSlider from "./sliderCom";

export default function Creater({Images,handler}) {
    
    return(
        <div className="underTaker gap-6">
            <div className="flex p-1 relative h-[400px] items-center justify-center overflow-hidden">
                <ImageSlider imgArray={Images} setArray={handler} />
            </div>
            <div class="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                <h2 class="text-white text-xl font-semibold">Glass Effect ✨</h2>
                <p class="text-white/80 text-sm">This area looks like frosted glass.</p>
            </div>

        </div>
    )
}