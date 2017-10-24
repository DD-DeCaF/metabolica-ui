import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


interface Credentials {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  appName: string;
  credentials: Credentials;
  nextUrl: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.appName = 'iLoop Web Platform';
    this.credentials = {
      username: '',
      password: ''
    };
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.nextUrl = params.next
    })
  }

  authenticate(form: any): void {
    if (this.credentials.username === 'valid') {
      if (this.nextUrl) {
        this.router.navigateByUrl(this.nextUrl);
      } else {
        this.router.navigateByUrl('/');
      }
    } else {
      form.resetForm();
      form.control.setErrors({'invalidCredentials': true});
    }

  }
}
