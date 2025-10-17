import { database } from "../../Controllers/myConnectionFile.js";

export const CrntUser = async (rkv,rspo) => {
    let {id} = rkv.authData;
    try {
        let [userinfo] = await database.execute(
        "SELECT avatar FROM users WHERE id=?",
        [id]
    )
        rspo.status(302).send({userinfo})
    } catch (error) {
        rspo.status(500).send({err:"Server side error",details:error.message})
    }
}