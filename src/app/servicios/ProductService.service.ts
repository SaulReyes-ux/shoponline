import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl)
      .pipe(
        catchError(error => {
          console.error('Error al obtener productos:', error);
          return throwError(error);
        })
      );
  }

  createProduct(product: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, product)
      .pipe(
        catchError(error => {
          console.error('Error al crear producto:', error);
          return throwError(error);
        })
      );
  }

  updateProduct(product: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${product.id}`, product)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar producto:', error);
          return throwError(error);
        })
      );
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`)
      .pipe(
        catchError(error => {
          console.error('Error al eliminar producto:', error);
          return throwError(error);
        })
      );
  }

  
}
