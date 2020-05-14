import { Injectable, NotFoundException } from '@nestjs/common'

import { Product } from './product.model'

@Injectable()
export class ProductsService {
  products: Product[] = []

  insertProduct(title: string, description: string, price: number) {
    const prodId = Math.random().toString()
    const newProduct = new Product(prodId, title, description, price)
    this.products.push(newProduct)
    return prodId
  }

  getProducts() {
    return [...this.products]
  }

  private findProduct(productId: string): [Product, number] | NotFoundException {
    const productIndex = this.products.findIndex((prod) => prod.id === productId)
    const product = this.products[productIndex]

    if (!product) {
      return new NotFoundException()
    }

    return [product, productIndex]
  }

  getSingleProduct(productId: string) {
    return this.findProduct(productId)[0]
  }

  updateProduct(productId: string, title: string, description: string, price: number) {
    const res = this.findProduct(productId)

    if (res instanceof NotFoundException) {
      return res
    }

    const [product, index] = res
    this.products[index] = {
      id: product.id,
      title: title || product.title,
      description: description || product.description,
      price: price || product.price,
    }
  }

  deleteProduct(productId: string) {
    const res = this.findProduct(productId)

    if (res instanceof NotFoundException) {
      return res
    }

    const index = res[1]
    this.products.splice(index, 1)
  }
}