import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MtxAlertModule } from '@ng-matero/extensions/alert';
import { MtxProgressModule } from '@ng-matero/extensions/progress';

export interface Stat {
  title: string,
  amount: string,
  progress: {
    value: number,
  },
  color: string
}

@Component({
  selector: 'app-progress-card',
  imports: [MtxProgressModule, MtxAlertModule, MatCardModule],
  template: `
    <mat-card [class]="['text-white', 'b-0', stat.color]">
        <mat-card-header>
          <mat-card-subtitle class="text-white">{{ stat.title }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <h2 class="m-t-0 m-b-8">{{ stat.amount }}</h2>
          <mtx-progress
            [value]="stat.progress.value"
            height="2px"
            foreground="rgba(255,255,255,1)"
            background="rgba(0,0,0,.4)"
          />
          <small class="text-muted">Monthly</small>
        </mat-card-content>
      </mat-card>
  `,
})
export class ProgressCardComponent {
  @Input() stat: Stat = {} as Stat;
}
