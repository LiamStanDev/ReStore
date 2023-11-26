export default interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  pictureUrl: string;
  type?: string;
  brand: string;
  quantityInStock?: number;
}

export interface ProductParams {
  searchTerm?: string;
  orderBy: string;
  types?: string[];
  brands?: string[];
  pageNumber: number;
  pageSize: number;
}
