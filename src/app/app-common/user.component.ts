import {Component, Input} from '@angular/core';
import {User} from '../app.resources';

@Component({
  selector: 'app-user',
  template: `<span [matTooltip]="getTooltip()">{{value.shortFullName()}}</span>`,
  styles: ['']
})
export class UserComponent {
  @Input() value: User;

  getTooltip(): string {
    if (this.value.title) {
      return `${this.value.displayName} (${this.value.title})`;
    }
    return this.value.displayName;
  }

}
