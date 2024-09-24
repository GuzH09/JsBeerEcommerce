import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async ({params, request}) => {
  const products = await getEntry("products", "data");
  const product = products.data.products.find((product) => product.id === Number(params.id));
  return new Response(JSON.stringify(product), {
    headers: {
      "content-type": "application/json",
    },
    status: 200,
  });
};