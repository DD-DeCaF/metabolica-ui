import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-maintenance-dialog',
  templateUrl: './maintenance-dialog.component.html'
})
export class MaintenanceDialogComponent {

  constructor(public dialogRef: MatDialogRef<MaintenanceDialogComponent>) { }

  retry() {
    console.log('retry')
    // retry http buffer
    this.dialogRef.close();
  }


}
