import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import { Report } from '../reports-list-model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChartSelectorComponent } from '../chart-selector/chart-selector.component';
import { PivotBuilderComponent } from '../pivot-builder/pivot-builder.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ComponentType } from '@angular/core/src/render3';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.scss']
})
export class InsertComponent implements OnInit {
  public reportsData: Report;
  public insertOptions = [
    { label: 'Chart', id: 'chart', component: ChartSelectorComponent },
    { label: 'Pivot', id: 'pivot', component: PivotBuilderComponent }
  ];
  constructor(private reportsService: ReportsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const reportId = +params.get('reportId');
      if (reportId) {
        this.getReport(reportId);
      }
    });
  }

  getReport(reportId: number) {
    this.reportsService.getReportData(reportId).subscribe(data => {
      console.log('data', data);
      this.reportsData = data;
    });
  }

  getKeys(obj) {
    return Object.keys(obj);
  }

  openNewSheet(sheetData: {label: string, id: string, component: any}) {
    console.log(sheetData);
    this.dialog.open(sheetData.component, {
      width: '800px',
      height: '500px',
      data: this.reportsData.pages[0].data
    }).afterClosed().subscribe(data => {
      console.log(data);
      let type = 'chart';
      if (sheetData.component instanceof PivotBuilderComponent) {
        type = 'pivot';
      }
      if (data) {
      const newSheetLabel = `Sheet${this.reportsData.pages.length + 1}`;
      const newSheetData = {
        label: newSheetLabel,
        data: data,
        type: type
      };
      this.reportsData.pages.push(newSheetData);
      this.snackBar.open(`${newSheetLabel} added successfully`, null, {
        duration: 1000
      });
    }
    });
  }

}
