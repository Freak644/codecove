const commentQue = [];

export const QueueComment = async (data) => {
    commentQue.push(data);
}

export const getCommentQue = ()=> commentQue;