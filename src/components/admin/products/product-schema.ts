
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be positive' }),
  stock: z.coerce.number().int({ message: 'Stock must be a whole number' }).nonnegative({ message: 'Stock cannot be negative' }),
  category: z.enum(['wheat', 'rice'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  image: z.string().url({ message: 'Please enter a valid image URL' }),
});

// Define the type that matches our form data and schema
export type ProductFormData = z.infer<typeof productSchema>;
