import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly DEFAULT_TIMEOUT = 30000; // 30 segundos

  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Aplicar timeout a todas as requisições
    return next.handle(request).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      catchError(error => {
        if (error instanceof TimeoutError) {
          this.snackBar.open(
            'A requisição está demorando mais que o esperado. Por favor, tente novamente mais tarde.',
            'Fechar',
            { duration: 5000 }
          );
        }
        return throwError(() => error);
      })
    );
  }
} 