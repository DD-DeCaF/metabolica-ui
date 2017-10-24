import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SessionService} from "../session/session.service";


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

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private session: SessionService) {
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
    this.session.authenticate(this.credentials).then(() => {
      if (this.nextUrl) {
        this.router.navigateByUrl(this.nextUrl);
      } else {
        this.router.navigateByUrl('/');
      }
    }).catch(invalidCredentials => {
      form.resetForm();
      form.control.setErrors({'invalidCredentials': true});
    });
  }
}
