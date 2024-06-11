import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
//import { Product } from '@domain/product';
import { ProductService } from '../../servicios/ProductService.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService, ProductService],
})
export class ProductosComponent implements OnInit {

  productDialog: boolean = false;

  products: Producto[] = [];

  product: Producto = {} as Producto;

  selectedProducts: Producto[] | null = null;

  submitted: boolean = false;

  statuses: any[] = [];

  constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data) => {
      console.log(data);
      this.products = data;
    });

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];
  }

  openNew() {
    this.product = {} as Producto;
    this.submitted = false;
    this.productDialog = true;
  }

 

  editProduct(product: Producto) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedProducts?.forEach(product => {
          this.productService.deleteProduct(product.id).subscribe({
            next: () => {
              this.products = this.products.filter((val) => val.id !== product.id);
            },
            error: (err) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Product', life: 3000 });
              console.error('Error deleting product:', err);
            }
          });
        });
        this.selectedProducts = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  deleteProduct(product: Producto) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${product.nombre}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.products = this.products.filter((val) => val.id !== product.id);
            this.product = {} as Producto;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Product', life: 3000 });
            console.error('Error deleting product:', err);
          }
        });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
  
    if (this.product.nombre?.trim()) {
      if (this.product.id) {
        this.productService.updateProduct(this.product).subscribe(
          updatedProduct => {
            const index = this.products.findIndex(p => p.id === updatedProduct.id);
            if (index !== -1) {
              this.products[index] = updatedProduct;
            }
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          },
          error => {
            console.error('Error al actualizar producto:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product', life: 3000 });
          }
        );
      } else {
        this.productService.createProduct(this.product).subscribe(
          newProduct => {
            this.products.push(newProduct);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          },
          error => {
            console.error('Error al crear producto:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create product', life: 3000 });
          }
        );
      }
  
      this.productDialog = false;
      this.product = {} as Producto;
    }
  }
  

  findIndexById(id: number): number {
    return this.products.findIndex((product) => product.id === id);
  }

  createId(): number {
    return Math.floor(Math.random() * 100000);
  }


  
  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
    return '';
  }

  
}



