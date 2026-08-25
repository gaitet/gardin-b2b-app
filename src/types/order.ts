export type OrderItem = {
  productId: number;
  quantity: number;
};

export type Order = {
  dealerId: number;
  comment: string;
  items: OrderItem[];
};