import { Component,OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule,FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  searchText: string = '';
  selectedCategory: number | null = null;
categories: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private auth:AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }
  
    loadProducts() {
    this.productService
      .getProducts(this.selectedCategory, this.searchText)
      .subscribe(res => {
        this.products = res;
      });
  }
     // 🔥 Load categories from DB
  loadCategories() {
    this.productService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  addToCart(product: any) {
  const userId = this.auth.getUserId(); // from logged-in user
  if (!userId) {
    alert('Please login first');
    return;
  }
  this.cartService.addToCart(userId, product.Id);
  console.log(product);
  }

   // TAB CLICK
  selectCategory(cat: any) {
  this.selectedCategory = cat ? cat.Id : null;
  this.loadProducts();
}

  // SEARCH
  onSearch() {
    this.loadProducts();
  }
}
