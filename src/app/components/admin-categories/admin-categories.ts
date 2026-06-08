import { Component, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../services/category';
import { LoadingService } from '../../services/loading';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategoriesComponent implements OnInit {

  categories = signal<any[]>([]);
  newCategory: string = '';
  editId: number | null = null;
  editName: string = '';

  constructor(private categoryService: CategoryService,
    private loadingService:LoadingService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loadingService.show();
    this.categoryService.getAll().subscribe(res => {
      this.categories.set (res.data);
      this.loadingService.hide();
      
    });
  }

  // ADD
  addCategory() {
    if (!this.newCategory.trim()) return;
    this.categoryService.add(this.newCategory).subscribe({
      next: () => { 
        Swal.fire({
  icon: 'success',
  title: 'New Category',
  text: 'Category added successfully',
  timer: 2000,
  showConfirmButton: false
});
      this.newCategory = '';
      this.load();
      },
      error: (err) => {
        Swal.fire({
  icon: 'error',
  title: 'Failed',
  text: err.error?.message || 'Could not add category'
});
      }
    });
  }

  // START EDIT
  startEdit(cat: any) {
    this.editId = cat.Id;
    this.editName = cat.Name;
  }

  // SAVE EDIT
  saveEdit() {
    if (!this.editId) return;

    this.categoryService.update(this.editId, this.editName)
      .subscribe(() => {
        this.editId = null;
        this.editName = '';
        this.load();
      });
  }

  // DELETE
  deleteCategory(id: number) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This Category will be permanently deleted!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33'
      }).then((result) => {
    if (result.isConfirmed) {
        this.categoryService.delete(id).subscribe(() => {
          Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              timer: 1500,
              showConfirmButton: false
            });
    
          this.load();
        });
      }
      });
  }
}
