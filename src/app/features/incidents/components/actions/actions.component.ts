import { Component } from '@angular/core';

@Component({
  selector: 'app-actions',
  imports: [],
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {

  currentAction = 'Cambiar estado';

  showAction(action: string) {
    this.currentAction = action;
  }

}
