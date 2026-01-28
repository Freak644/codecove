export const acceptSolution = async (rkv,rspo) => {
    let {id} = rkv.authData;
    let {commentID} = rkv.body;

    try {
        if (!commentID || !commentID.trim()) return rspo.status(401).send({err:"Unauthorize Request"});
        // rspo.status(200).send({pass:"Done"})
    } catch (error) {
        console.log({message:error.message,error});
        rspo.status(500).send({err:"Server side error"});
    }
}