import { Component } from '@angular/core';

import { GetNumberPage } from '../getnumber/getnumber';
import { StatisticsPage } from '../statistics/statistics';
import { AlarmPage } from '../alarm/alarm';
import { RequestControlProvider } from '../../providers/request-control/request-control';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = GetNumberPage;
  tab2Root = AlarmPage;
  tab3Root = StatisticsPage;
  
  constructor(public requestControl: RequestControlProvider) {
  }
}
