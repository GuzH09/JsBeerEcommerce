import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

export const GET: APIRoute = async ({params, request}) => {
  const products = await getEntry("products", "data");
  return new Response(JSON.stringify(products.data.products), {
    headers: {
      "content-type": "application/json",
    },
    status: 200,
  });
};