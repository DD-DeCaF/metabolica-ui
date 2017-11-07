import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ProjectResolverService implements Resolve<any> {

  constructor(private http: HttpClient, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot) {
    const url = `/api/project/${route.paramMap.get('project')}`;

    return new Promise((resolve, reject) =>
      this.http.get(url).subscribe(
        result => resolve(result),
        error => {
          this.router.navigate(['/home']);
          resolve(null);
        })
      );

  }

}
