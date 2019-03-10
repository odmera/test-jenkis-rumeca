import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdLoadingService } from '@covalent/core/loading';


import { single, multi } from './data';


@Component({
  selector: 'qs-product-menu',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  // Chart
  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Sales';
  axisDigits: boolean = true;

  colorScheme: any = {
    domain: ['#1565C0', '#03A9F4', '#FFA726', '#FFCC80'],
  };

  // line, area
  autoScale: boolean = true;


  constructor(private _titleService: Title,
    private _loadingService: TdLoadingService) {
    
}

  ngOnInit(): void {

    this._titleService.setTitle('Inicio');

      // Chart
      // Chart Single
      Object.assign(this, {single});
      // Chart Multi
      this.multi = multi.map((group: any) => {
        group.series = group.series.map((dataItem: any) => {
          dataItem.name = new Date(dataItem.name);
          return dataItem;
        });
        return group;
      });

    /*
    this._loadingService.register('items.load');
    this._itemsService.query().subscribe((items: Object[]) => {
      this.items = items;
      setTimeout(() => {
        this._loadingService.resolve('items.load');
      }, 750);
    }, (error: Error) => {
      this._itemsService.staticQuery().subscribe((items: Object[]) => {
        this.items = items;
        setTimeout(() => {
          this._loadingService.resolve('items.load');
        }, 750);
      });
    });
    this._loadingService.register('alerts.load');
    this._alertsService.query().subscribe((alerts: Object[]) => {
      this.alerts = alerts;
      setTimeout(() => {
        this._loadingService.resolve('alerts.load');
      }, 750);
    });
    this._loadingService.register('products.load');
    this._productsService.query().subscribe((products: Object[]) => {
      this.products = products;
      setTimeout(() => {
        this._loadingService.resolve('products.load');
      }, 750);
    });
    this._loadingService.register('favorites.load');
    this._productsService.query().subscribe((products: Object[]) => {
      this.products = products;
      setTimeout(() => {
        this._loadingService.resolve('favorites.load');
      }, 750);
    });

    /*
    this._loadingService.register('users.load');
    this._userService.query().subscribe((users: IUser[]) => {
      this.users = users;
      setTimeout(() => {
        this._loadingService.resolve('users.load');
      }, 750);
    }, (error: Error) => {
      this._userService.staticQuery().subscribe((users: IUser[]) => {
        this.users = users;
        setTimeout(() => {
          this._loadingService.resolve('users.load');
        }, 750);
      });
    });*/
  }
}
