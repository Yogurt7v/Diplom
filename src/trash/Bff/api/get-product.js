import { transformProducts } from "../transformers";

export const getProduct = async (productId) =>
  await fetch(`http://localhost:3005/products/${productId}`)
  .then((res)=> {
    if (res.ok) {
       return res
    }

    const error = res.status === 404 ? "Такого не существует" : "Ошибка";

    return Promise.reject(error);

  })
    .then((loadedProduct) => loadedProduct.json())
    .then((loadedPr) => loadedPr && transformProducts(loadedPr));