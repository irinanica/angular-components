import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TGridComponent } from "./t-grid/t-grid.component";
import { TColumnComponent } from "./t-grid/t-column/t-column.component";
import { TProgressComponent } from "./t-progress/t-progress.component";
import { PageDetails, PersonDetails, SortDetails } from "./types";
import { DataService } from "./data.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TGridComponent, TColumnComponent, TProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  tableData: PersonDetails[] = [];
  totalSize: number = 0;
  progress: number = 0;
  color: string = '#3498db';
  radius: number = 16;

  private currentPage: number = 1;
  private pageSize: number = 10;
  private sortDetails?: SortDetails<PersonDetails>;

  constructor(private changeDetectorRef: ChangeDetectorRef, private dataService: DataService) {
  }

  ngOnInit() {
    this.fetchTableData();
    this.simulateProgress();
  }

  performFetch(details: PageDetails): void {
    const { currentPage, pageSize } = details;
    this.currentPage = currentPage;

    if (pageSize) {
      this.pageSize = pageSize;
    }

    this.fetchTableData();
  }

  onSortChange(sort: SortDetails<PersonDetails>): void {
    this.sortDetails = sort;
    this.currentPage = 1;
    this.fetchTableData();
  }

  private fetchTableData(): void {
    this.dataService.getData(this.currentPage, this.pageSize, this.sortDetails).subscribe({
      next: ({ data, totalSize }) => {
        this.tableData = data;
        this.totalSize = totalSize;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  onComplete(): void {
    console.log('Loading finished...')
  }

  simulateProgress(): void {
    const interval = setInterval(() => {
      this.progress += 5;
      this.changeDetectorRef.detectChanges();

      if (this.progress >= 100) {
        clearInterval(interval);
      }
    }, 1000);
  }
}
