import { Component, Input } from '@angular/core';

@Component({
  selector: 't-column',
  standalone: true,
  imports: [],
  templateUrl: './t-column.component.html',
  styleUrl: './t-column.component.scss'
})
export class TColumnComponent<T> {
  @Input() name: string = '';
  @Input() property!: keyof T;
  @Input() sortable: boolean = true;
}
