import api from "./api";

export const getCart = async () => {
    const response = await api.get("/cart");
    return response.data;
};

export const addToCartAPI = async (productId) => {
    const response = await api.post("/cart", {
        productId,
    });

    return response.data;
};

export const updateCartQuantityAPI = async (
    productId,
    quantity
) => {
    const response = await api.put(
        `/cart/${productId}`,
        {
            quantity,
        }
    );

    return response.data;
};

export const removeFromCartAPI = async (productId) => {
    const response = await api.delete(
        `/cart/${productId}`
    );

    return response.data;
};