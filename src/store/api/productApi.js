import api from "../../utils/api";

export const productApi = {
  getOptions: () => api.get("/api/products/options"),

  getStats: () => api.get("/api/products/stats/summary"),

  getProducts: (params) => api.get("/api/products", { params }),

  getProductsByCategory: (category, params) =>
    api.get(`/api/products/category/${category}`, { params }),

  getProductById: (id) => api.get(`/api/products/${id}`),

  createProduct: (data) => api.post("/api/products", data),

  createProductWithImage: (formData) =>
    api.post("/api/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),

  updateProductWithImage: (id, formData) =>
    api.put(`/api/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteProduct: (id) => api.delete(`/api/products/${id}`),

  uploadImage: (formData) =>
    api.post("/api/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
