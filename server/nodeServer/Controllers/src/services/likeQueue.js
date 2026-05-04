const likeQue = [];

export const QueueLikeUpdate = async (data) => {
    console.log(data)
    likeQue.push(data);
}

export const getQueue = ()=> likeQue;