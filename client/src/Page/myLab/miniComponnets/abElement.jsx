export default function MainAchievments({achiveData}) {
    
    return(
        <div className="underTaker">
            <div className="h-full w-full overflow-hidden rounded-full  perspective-distant flex items-center justify-center">
                <div className="miniCube  h-full w-full text-skin-text transition-all transform-3d duration-1000 relative! flex items-center justify-center">
                    <div className="miniFace">
                        <img src="https://res.cloudinary.com/dcq0dge7f/image/upload/v1767026019/Knowledge_Monke_dhcc0o.png" className="h-full w-full rounded-full " alt="" />
                    </div>
                    <div className="miniFace">
                        <img src="https://res.cloudinary.com/dcq0dge7f/image/upload/v1767026018/bugWizard_lkt3ji.png" className="h-full w-full rounded-full " alt="" />
                    </div>
                    <div className="miniFace">
                        <img src="https://res.cloudinary.com/dcq0dge7f/image/upload/v1767026018/Heroic_heart_c2lym9.png" className="h-full w-full rounded-full " alt="" />
                    </div>
                    <div className="miniFace">
                        <img src="https://res.cloudinary.com/dcq0dge7f/image/upload/v1766861453/wallpaperflare.com_wallpaper_eqctuo.jpg" className="h-full w-full rounded-full " alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}