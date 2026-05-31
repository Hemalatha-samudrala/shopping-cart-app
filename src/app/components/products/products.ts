import { Component,OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  imports: [CommonModule,FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent implements OnInit {
  env = environment;
  products: any[] = [];

searchText: string = '';
selectedCategory: number | null = null;

categories: any[] = [];

limit: number = 12;
cursor: number | null = null;

hasMore: boolean = true;
loading: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private auth:AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }
  
    loadProducts(reset: boolean = false) {

  if (this.loading || (!this.hasMore && !reset)) return;

  this.loading = true;

  if (reset) {
    this.products = [];
    this.cursor = null;
    this.hasMore = true;
  }

  this.productService
    .getProducts(
      this.selectedCategory,
      this.searchText,
      this.limit,
      this.cursor
    )
    .subscribe({
      next: (res) => {

  const data = res.data;

  this.products = [
    ...this.products,
    ...data.products
  ];

  this.cursor = data.nextCursor;
  this.hasMore = data.hasMore;

  this.loading = false;
},
      error: () => {
        this.loading = false;
      }
    });
}
     // 🔥 Load categories from DB
  loadCategories() {
    this.productService.getCategories().subscribe(res => {
      this.categories = res.data;
    });
  }

addToCart(product: any) {

  const userId = this.auth.getUserId();

  if (!userId) {
    Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'Please login first'
    });
    return;
  }

  this.cartService.addToCart(product.Id)
    .subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'Product added to cart',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
         Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err.error?.message || 'Could not add to cart'
        });
      }
    });

  }

   // TAB CLICK
  selectCategory(cat: any) {
  this.selectedCategory = cat ? cat.Id : null;
  this.loadProducts(true);
}

  // SEARCH
  onSearch() {
    this.loadProducts(true);
  }
 
}
