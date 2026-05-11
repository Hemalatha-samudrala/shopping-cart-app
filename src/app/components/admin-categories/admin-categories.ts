import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategoriesComponent implements OnInit {

  categories: any[] = [];
  newCategory: string = '';
  editId: number | null = null;
  editName: string = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
    });
  }

  // ADD
  addCategory() {
    if (!this.newCategory.trim()) return;

    this.categoryService.add(this.newCategory).subscribe(() => {
      this.newCategory = '';
      this.load();
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
    if (!confirm('Delete category?')) return;

    this.categoryService.delete(id).subscribe(() => {
      this.load();
    });
  }
}
