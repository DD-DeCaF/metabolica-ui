import {Component, OnInit, Input} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-xref-menu',
  templateUrl: './xref-menu.component.html',
  styleUrls: ['./xref-menu.component.css']
})
export class XrefMenuComponent implements OnInit {
  @Input() type: string;
  @Input() value: any;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog($event) {
    let dialogRef = this.dialog.open(DialogComponent, {
      height: '350px',
      data: {},
      backdropClass: 'transparent',
      position: {

      }
    });
  }

}

@Component({
  selector: 'dialog-component',
  template: `<mat-dialog-content>dialog content</mat-dialog-content>`
})
export class DialogComponent {

}
