import { Component, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../services/category';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';
import { LoadingService } from '../../services/loading';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProductsComponent implements OnInit {
  env = environment;
  products = signal<any[]>([]);
  categories = signal<any[]>([]);

  limit: number = 12;
cursor: number | null = null;

hasMore: boolean = true;
loading: boolean = false;

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
    private auth: AuthService,
    private loadingService:LoadingService
  ) {}

  ngOnInit() {
    this.loadProducts(true);
     this.loadCategories();
  }

  // ---------- LOAD PRODUCTS ----------
    loadProducts(reset: boolean = false) {

  if (this.loading || (!this.hasMore && !reset)) return;

  this.loadingService.show();

  if (reset) {
    this.products.set([]);
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

  this.products.set([
    ...this.products(),
    ...data.products
  ]);

  this.cursor = data.nextCursor;
  this.hasMore = data.hasMore;

  this.loadingService.hide();

},
      error: () => {
        this.loadingService.hide();
      }
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
    this.productService.addProduct(formData).subscribe({
      next: () => {
      
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'Product added',
          timer: 1500,
          showConfirmButton: false
        });
        setTimeout(() => {
    this.resetForm();
    this.loadProducts(true);
  });
      },
      error: (err) => {

  Swal.fire({
    icon: 'error',
    title: 'Failed',
    text: err.error?.message || 'Could not add product'
  });
}
    });
  }

  // ---------- EDIT CLICK ----------
  editProduct(p: any) {
    this.isEditMode = true;

    this.product.id = p.id;
    this.product.productName = p.productName;
    this.product.price = p.price;
    this.product.CategoryId = p.CategoryId;
    this.product.stock = p.stock;
    this.selectedFile = null;
  }

  // ---------- UPDATE PRODUCT ----------
 updateProduct() {
    if (!this.product.id) {
    Swal.fire({
      icon: 'warning',
      title: 'Id Required',
      text: 'Product Id not found'
    });
    return;
  }
    const formData = new FormData();

    formData.append('productName', this.product.productName ?? '');
    formData.append('price', String(this.product.price ?? 0));
    formData.append('categoryId', String(this.product.CategoryId ?? ''));
    formData.append('stock', String(this.product.stock ?? 0));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.updateProduct(this.product.id, formData)
      .subscribe({
        next: () => {
          Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Product Updated',
          timer: 1500,
          showConfirmButton: false
        });
          setTimeout(() => {
    this.resetForm();
    this.loadProducts(true);
  });
        },
        error: (err) => {

  console.log('UPDATE ERROR:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: err.error?.message || 'Could not update product'
          });
}
      });
  }

  // ---------- DELETE ----------
  deleteProduct(id: number) {
    Swal.fire({
    title: 'Are you sure?',
    text: 'This product will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33'
  }).then((result) => {

    if (result.isConfirmed) {
    this.productService.deleteProduct(id).subscribe(() => {
      Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          timer: 1500,
          showConfirmButton: false
        });

       setTimeout(() => {
    this.loadProducts(true);
  });
    });
  }
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
    this.categories.set(res.data);
  });
}

}