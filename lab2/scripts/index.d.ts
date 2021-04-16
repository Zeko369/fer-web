export declare global {
  interface Window {
    cartService: CartService;
    cache: {
      id: number;
      name: string;
      price: number;
      categoryId: number;
      imageUrl: string;
    }[];
  }
}
