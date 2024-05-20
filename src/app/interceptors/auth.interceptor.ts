import { HttpInterceptorFn } from '@angular/common/http';
import { HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  // Clone the request to add the new withCredentials property
  const clonedRequest = req.clone({
    withCredentials: true
  });

  // Pass on the cloned request instead of the original request
  console.log('adding interceptor')
  return next(clonedRequest);
};

