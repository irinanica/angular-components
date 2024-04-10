import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { TColumnComponent } from "./t-column/t-column.component";
import { CommonModule } from "@angular/common";
import { Direction, PageDetails, SortDetails } from "../types";

@Component({
  selector: 't-grid',
  standalone: true,
  templateUrl: './t-grid.component.html',
  imports: [CommonModule],
  styleUrl: './t-grid.component.scss',
})
export class TGridComponent<T> implements OnInit, OnChanges {
  @Input() data: T[] = [];
  @Input() sortable: boolean = true;
  @Input() pageSize: number = 10;
  @Input() totalSize: number = 0;

  @Output() sortChange = new EventEmitter<SortDetails<T>>();
  @Output() paginationChange = new EventEmitter<PageDetails>();

  @ContentChildren(TColumnComponent) columns!: QueryList<TColumnComponent<T>>;

  currentSort: SortDetails<T> | null = null;
  currentPage = 1;
  totalPages = 0;

  ngOnInit() {
    this.calculateTotalPages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalSize']) {
      this.calculateTotalPages();
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalSize / this.pageSize);
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.currentPage = newPage;
    this.paginationChange.emit({ currentPage: this.currentPage, pageSize: this.pageSize });
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newSize = parseInt(selectElement.value);

    if (!newSize) {
      return;
    }

    this.pageSize = newSize;
    this.calculateTotalPages();
    this.currentPage = 1;

    this.paginationChange.emit({ currentPage: this.currentPage, pageSize: this.pageSize });
  }

  sort(column: TColumnComponent<T>): void {
    if (!this.sortable || !column.sortable) {
      return;
    }

    if (!this.currentSort || this.currentSort.columnName !== column.property) {
      this.currentSort = { columnName: column.property, direction: Direction.Ascending };
    } else {
      this.currentSort.direction =
        this.currentSort.direction === Direction.Ascending ? Direction.Descending : Direction.Ascending;
    }

    this.currentPage = 1;
    this.sortChange.emit(this.currentSort);
  }
}
