import { Component } from '@angular/core';

import { QueuePage } from '../queue/queue';
import { GetNumberPage } from '../getnumber/getnumber';
import { StatisticsPage } from '../statistics/statistics';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = GetNumberPage;
  tab2Root = QueuePage;
  tab3Root = StatisticsPage;
  
  constructor() {

  }
}
