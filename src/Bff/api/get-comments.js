import { transformComment } from "../transformers";

const ALL_COMMENTS_URL = `http://localhost:3004/comments`
const POST_COMMENTS_URL = `http://localhost:3004/comments/?productsId=`


export const getComments = async (postId) => {
  const url = postId === undefined ? ALL_COMMENTS_URL : POST_COMMENTS_URL + postId;

  return fetch(url)
    .then((loadedComments) =>loadedComments.json()
    .then((loadedComments) => loadedComments.map(transformComment))
  );
}


