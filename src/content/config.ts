import { z, defineCollection } from "astro:content";

const productsCollection = defineCollection({
  type: "data",
  schema: ({ image }) => z.object({
    products: z.array(
      z.object({
        name: z.string(),
        cost: z.number(),
        imageSrc: image(),
        imageAlt: z.string(),
        category: z.string(),
        id: z.number()
      })
    )
  }),
});

export const collections = {
  'products': productsCollection,
};
