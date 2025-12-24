// File: src/store/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api', // સ્ટોરમાં આ નામ રહેશે
    baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com' }),
    endpoints: (builder) => ({
        // બધા પ્રોડક્ટ્સ લાવવા માટે
        getProducts: builder.query({
            query: () => '/products',
        }),
        // કોઈ એક કેટેગરીના પ્રોડક્ટ લાવવા હોય તો (Future માટે)
        getProductsByCategory: builder.query({
            query: (category) => `/products/category/${category}`,
        }),
    }),
});

// RTK Query આપોઆપ આ Hooks બનાવી આપે છે
export const { useGetProductsQuery, useGetProductsByCategoryQuery } = apiSlice;