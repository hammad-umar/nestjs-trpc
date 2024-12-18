import { Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      throw new TRPCError({
        message: 'Product not found!',
        code: 'NOT_FOUND',
      });
    }

    return product;
  }

  createProduct(productData: Product): Product {
    this.products.push(productData);
    return productData;
  }

  updateProduct(id: string, data: Partial<Product>): Product {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) {
      throw new TRPCError({
        message: 'Product not found!',
        code: 'NOT_FOUND',
      });
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...data,
    };

    return this.products[productIndex];
  }

  deleteProduct(id: string): boolean {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) {
      return false;
    }

    this.products.splice(productIndex, 1);
    return true;
  }
}
