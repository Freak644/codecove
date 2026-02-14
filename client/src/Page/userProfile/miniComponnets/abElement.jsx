export default function MainAchievments({achiveData}) {
    
    return(
        <div className="underTaker">
            <div className="h-full w-full overflow-hidden rounded-full  perspective-distant flex items-center justify-center">
                <div className="miniCube  h-full w-full text-skin-text transition-all transform-3d duration-1000 relative! flex items-center justify-center">
                    <div className="miniFace">
                        <img src="https://res.cloudinary.com/dcq0dge7f/image/upload/v1768566724/Heroic_heart_lfftur.png" className="h-full w-full rounded-full " alt="" />
                    </div>
                    <div className="miniFace">
                        <img src="https://res.cloudinary.com/dcq0dge7f/image/upload/v1769183137/bugWizard_cijg6l.png" className="h-full w-full rounded-full " alt="" />
                    </div>
                    <div className="miniFace">
                        <img src="https://res.cloudinary.com/dcq0dge7f/image/upload/v1768566633/Knowledge_Monke_r2menj.png" className="h-full w-full rounded-full " alt="" />
                    </div>
                    <div className="miniFace">
                        <img src="https://res.cloudinary.com/dcq0dge7f/image/upload/v1768566631/bugWizard_yhqiye.png" className="h-full w-full rounded-full " alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}