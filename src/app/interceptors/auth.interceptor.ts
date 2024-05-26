import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);

  // Clone the request to add the new withCredentials property
  const clonedRequest = req.clone({
    withCredentials: true
  });

  // Pass on the cloned request instead of the original request
  console.log('adding interceptor')
  return next(clonedRequest).pipe(catchError((error: HttpErrorResponse)=>{
    if (error.status === 401){
      router.navigate(['login']);
    }
    return throwError(()=> error);
  }));
};

