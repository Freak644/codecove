export const followAPI = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/,"") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {user_id} = rkv.body;
    let {id} = rkv.authData;
    try {
        
    } catch (error) {
        rspo.status(500).send({err:"Server side error"});
    }
}