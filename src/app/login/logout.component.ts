import {Component, OnInit} from '@angular/core';
import {SessionService} from "../session/session.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private session: SessionService) {}

  ngOnInit() {
    this.session.logout();
    this.router.navigate(['login']);
  }
}
