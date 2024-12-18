import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc';
import { z } from 'zod';
import { ProductsService } from './products.service';
import { Product, productSchema } from './product.schema';
import { LoggerMiddleware } from '../trpc/middleware/logger.middleware';
import { IAppContext } from '../trpc/context/context.interface';

@Router({ alias: 'products' })
@UseMiddlewares(LoggerMiddleware)
export class ProductsRouter {
  constructor(private readonly productsService: ProductsService) {}

  @Query({
    output: z.array(productSchema),
  })
  getAllProducts(@Ctx() context: IAppContext): Product[] {
    console.log('Context', context);
    return this.productsService.getAllProducts();
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: productSchema,
  })
  getProductById(@Input('id') id: string): Product {
    return this.productsService.getProductById(id);
  }

  @Mutation({
    input: productSchema,
    output: productSchema,
  })
  createProduct(@Input() productData: Product): Product {
    return this.productsService.createProduct(productData);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      data: productSchema.partial(),
    }),
    output: productSchema,
  })
  updateProduct(
    @Input('id') id: string,
    @Input('data') data: Partial<Product>,
  ): Product {
    return this.productsService.updateProduct(id, data);
  }

  @Mutation({
    input: z.object({ id: z.string() }),
    output: z.boolean(),
  })
  deleteProduct(@Input('id') id: string): boolean {
    return this.productsService.deleteProduct(id);
  }
}
