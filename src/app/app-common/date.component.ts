import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-date',
  template: `<span [matTooltip]="value | date: 'fullDate'">{{ value | date: 'mediumDate'}}</span>`,
  styles: ['']
})
export class DateComponent {
  @Input() value: number;
}
