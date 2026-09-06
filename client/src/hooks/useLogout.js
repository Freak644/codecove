export const handleLogoutGlobal = async () => {
    let rqst = await fetch("/myServer/user/Logout")
    let result = await rqst.json();
    console.log(result)
    if (result.pass) {
        location.reload();
    }
}