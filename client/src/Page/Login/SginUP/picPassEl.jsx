import { useEffect, useState } from "react"
import { mngCrop } from "../../../lib/toggleTheme";
import FaceToggle, { toggleMini } from "../../../lib/tabToggle";
import { Loader } from "../../../lib/loader";
import verifyZu from "../../../lib/verifyZu";
import { toast } from "react-toastify";
export default function CpassEL() {
    const [myImage,setimg] = useState({
        file:null,
        fileUrl:""
    })
    const {setTab} = FaceToggle();
    // const [prevImage,setPrevImg] = useState(null);
    const {finalIMG,setURL} = mngCrop();
    const {toggleMiniTab} = toggleMini();
    const {isTrue,toggleLoader} = Loader();
    const {Tusername,email,emailStatus,setEstatus} = verifyZu();
    const [password,setPassword] = useState({
        password:"",
        strength:0,
        type:"password"
    });
    useEffect(()=>{
        if (!emailStatus) {
            toggleMiniTab("user")
        }
    },[])
    const handleImg = e=>{
        let myFIle = e.target.files[0]
        if (!myFIle) return ;

        if (myFIle.size > 3 * 1024 * 1024) {
            alert("File size <= 3MB")
            return
        }
        setURL(URL.createObjectURL(myFIle))
    }
    useEffect(()=>{
        if (finalIMG) {
            setimg(prev=>({
                ...prev,
                file:finalIMG,
                fileUrl:URL.createObjectURL(finalIMG)
            }));
        }
    },[finalIMG])


   const checkStrength = pwd => {
    let score = 0;
    if (/\s/.test(pwd)) {
        return toast.error("Space not allow")
    }
    //if (pwd.length >= 6) score++;            // basic length
    if (/[A-Z]/.test(pwd)) score++;          // upper case
    if (/[0-9]/.test(pwd)) score++;          // number
    if (/[^A-Za-z0-9]/.test(pwd)) score++;   // special char

    if (score > 3) score = 3; // max = 3 bars
    setPassword(prev=>({
        ...prev,
        strength:score
    }))
  };

    const handleChange = evnt=>{
        const val = evnt.target.value;
        setPassword(prev=>({
            ...prev,
            password:val
        }))
        checkStrength(val)
    }

    const getColor = () => {
     switch (password.strength) {
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-green-500";
      default: return "bg-gray-300";
    }
  };
    const getTColor = () => {
     switch (password.strength) {
      case 1: return "text-red-500";
      case 2: return "text-yellow-500";
      case 3: return "text-green-500";
      default: return "text-gray-300";
    }
  };

  
  const handleBlur = (inp)=>{
      if (inp && inp.value) {
          let labl = inp.nextElementSibling;
          labl.classList.add('activeLabl');
        } else if(inp && !inp.value) {
            let lbl = inp.nextElementSibling;
            lbl.classList.remove('activeLabl');
        }else{
            let divs = document.querySelectorAll('.inputDiv');
            divs.forEach(inpDiv=>{
                let input = inpDiv.querySelector('input');
                let lbal = inpDiv.querySelector('label');
                if (input && !input.value) {
                    lbal.classList.remove('activeLabl');
                } else if(input && input.value){
                    lbal.classList.add('activeLabl')
                }
            })
        }
    }
    const togglePassword = ()=>{
        let crntPass = password.type;
        if (crntPass==="password") {
            setPassword(prev=>({
                ...prev,
                type:"text"
            }))
        }else{
            setPassword(prev=>({
                ...prev,
                type:"password"
            }))
        }
    }
    const getClass = ()=>{
        switch (password.type) {
            case "text": return "show";
            case "password": return "hide";
            default:return "show"
        }
    }
     function validatePassword(password) {
        if (password.length < 6) {
            toast.warning("Password must be at least 6 characters long");
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            toast.warning("Password must contain at least one uppercase letter");
            return false;
        }

        if (!/\d/.test(password)) {
            toast.warning("Password must contain at least one number");
            return false;
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            toast.warning("Password must contain at least one special character");
            return false;
        }

        if (/\s/.test(password)) {
            toast.warning("Password must not contain spaces");
            return false;
        }

        // ✅ Passed all checks
        return true;
        }
    const handleSubmit = async (evnt) => {
        evnt.preventDefault();
        toggleLoader()
        if (!email?.trim() || !Tusername?.trim() || !password.password?.trim()) {
           return toast.info("Please provide proper information");
        }
        if (!/^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
            return toast.info("Email is currepted")
        }
        let pwdStatus = validatePassword(password.password)
        if(!pwdStatus) return;

        let formData = new FormData(evnt.target)


        formData.append("email", email);
        formData.append("username", Tusername);
        //formData.append("file",myImage.file); 


        try {
            let rkv = await fetch("/myServer/CreateUser",{
                method:"POST",
                body:formData
            })
            let result = await rkv.json();
            if (result.err) {
                throw new Error(result.err)
            }
            toast.success(result.pass)
            setEstatus()
            toggleMiniTab("user")
            toggleLoader();
            setTab("front")
        } catch (error) {
            toast.error(error.message)
        }
    }
    return(
        <div className="underTaker">
            <div className="picPass flex items-center justify-center">
                <div className="formDiv">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="Logotxt flex items-center flex-col w-[120px] absolute top-[-100px]">
                            <i className='bx bx-code-block text-5xl
                            transition-all duration-500 ease-in-out bg-[length:200%_200%]
                            bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                            bg-clip-text text-transparent
                            '></i>
                            <h2 className=' font-bold text-2xl transition-all duration-500 ease-in-out bg-[length:200%_200%]
                            bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                            bg-clip-text text-transparent'>CodeCove</h2>
                        </div>
                        <div className="inputDiv !flex-col !h-[80px]  !items-center">
                            <input type="file" onChange={(evnt)=>handleImg(evnt)} style={{display:"none"}} id="file" name="file" accept="image/*" multiple={false} />
                            <label className="!left-[40%] !top-13 !cursor-pointer" htmlFor="file"><i className="bx bx-image text-blue-500">Avatar</i></label>
                            <div onClick={()=> document.getElementById("file").click()}  className="imgDiv flex items-center justify-center h-13 w-13 rounded-full">
                                <img src={myImage?.fileUrl || "https://i.postimg.cc/zDK9mWZX/girl-anime.avif"} className="h-12 w-12 rounded-full" alt="DP" />
                            </div>
                        </div>
                        <div className="inputDiv">
                            <input type={password.type} name="password" id="password" onBlur={(evnt)=>handleBlur(evnt.target)} value={password.password} onChange={handleChange} />
                            <label htmlFor="password"><i className="bx bx-key">Password</i></label>
                            <i onClick={togglePassword} className={`bx bx-${getClass()} absolute text-gray-500 right-3 top-3 transition-all duration-300 cursor-pointer`}></i>
                            <div className="suggestionDiv absolute flex items-center justify-between bottom-[-14px] gap-1.5">
                                {
                                    [1,2,3].map(bar=>{
                                        return(
                                            <div key={bar} className={`h-2 w-5 flex-1 rounded transition-all duration-300 ${
                                              password.strength >= bar ? getColor() : "bg-gray-500"
                                            }`}></div>
                                        )
                                    })
                                }
                                <div className={`text-sm mt-2 ${getTColor() || "text-skin-ptext"}`}>
                                    {password.strength === 0 && "pwd.len>=6"}
                                    {password.strength === 1 && "Weak"}
                                    {password.strength === 2 && "Fair"}
                                    {password.strength === 3 && "Strong"}
                                </div>
                            </div>
                        </div>
                        <div className="inputDiv">
                            <button className="text-btn" type="button" onClick={()=>toggleMiniTab("user")}>Back</button>
                            <button type="submit" className="btn">{isTrue ? "Sgining" : "Sgin-up"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}