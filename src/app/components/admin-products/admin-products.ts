import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../services/category';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProductsComponent implements OnInit {
  env = environment;
  products: any[] = [];
  categories: any[] = [];


  searchText: string = '';

  product = {
    id: null,
    productName: '',
    price: null,
    CategoryId: null,
    stock:null
  };

  selectedFile: File | null = null;
  isEditMode: boolean = false;
  selectedCategory: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
     this.loadCategories();
  }

  // ---------- LOAD PRODUCTS ----------
  loadProducts() {
    this.productService
      .getProducts(this.selectedCategory, this.searchText)
      .subscribe(res => {
        this.products = res.data;
     
        console.log(res);
      });
  }

  // ---------- FILE SELECT ----------
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
 

  // ---------- ADD PRODUCT ----------
 addProduct() {
    const formData = new FormData();

    formData.append('productName', this.product.productName);
    formData.append('price', String(this.product.price ?? 0));
    formData.append('categoryId', String(this.product.CategoryId ?? ''));
    formData.append('stock', String(this.product.stock ?? 0));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    console.log('CategoryId:', this.product.CategoryId);
    this.productService.addProduct(formData).subscribe({
      next: () => {
        console.log(this.product);
        alert('Product added');
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
  console.log('BACKEND RESPONSE:', err.error);

  alert(err.error?.message || 'Add failed');
}
    });
  }

  // ---------- EDIT CLICK ----------
  editProduct(p: any) {
    this.isEditMode = true;

    this.product.id = p.Id;
    this.product.productName = p.ProductName;
    this.product.price = p.Price;
    this.product.CategoryId = p.CategoryId;
    this.product.stock = p.Stock;
    this.selectedFile = null;
  }

  // ---------- UPDATE PRODUCT ----------
 updateProduct() {
    if (!this.product.id) {
    alert('Invalid product ID');
    return;
  }
    const formData = new FormData();

    formData.append('productName', this.product.productName ?? '');
    formData.append('price', String(this.product.price ?? 0));
    formData.append('CategoryId', String(this.product.CategoryId ?? ''));
    formData.append('stock', String(this.product.stock ?? 0));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.updateProduct(this.product.id, formData)
      .subscribe({
        next: () => {
          alert('Updated successfully');
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {

  console.log('UPDATE ERROR:', err);

  alert(
    err.error?.message || 'Update failed'
  );
}
      });
  }

  // ---------- DELETE ----------
  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  // ---------- RESET ----------
  resetForm() {
    this.product = {
      id: null,
      productName: '',
      price: null,
      CategoryId: null,
      stock:null
    };
    this.selectedFile = null;
    this.isEditMode = false;
  }

  loadCategories() {
  this.categoryService.getAll().subscribe((res: any) => {
    this.categories = res.data;
  });
}

}