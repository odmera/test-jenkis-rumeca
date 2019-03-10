import {
  TestBed,
  inject,
  async,
  ComponentFixture,
} from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../shared/shared.module';
import { TdMediaService } from '@covalent/core/media';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrincipalComponent } from './principal.component';

describe('Component: DashboardProduct', () => {

  let noop: () => void = () => {
    // noop method
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [
        PrincipalComponent,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: TdMediaService, useValue: {
            registerQuery: noop,
            query: noop,
            broadcast: noop,
            createComponent: noop,
            createReplaceComponent: noop,
            register: noop,
            resolve: noop,
          },
        },
      ],
    })
    .compileComponents();
  }));

  it('should create the component', (done: any) => {
    let fixture: ComponentFixture<any> = TestBed.createComponent(PrincipalComponent);
    let testComponent: PrincipalComponent = fixture.debugElement.componentInstance;
    let element: HTMLElement = fixture.nativeElement;

    fixture.detectChanges();
    expect(element.querySelector('td-layout-manage-list')).toBeTruthy();
    fixture.whenStable().then(() => {
      expect(element.querySelector('a[ng-reflect-router-link="/product"]')).toBeTruthy();
      expect(element.querySelector('a[ng-reflect-router-link="stats"]')).toBeTruthy();
      expect(element.querySelector('a[ng-reflect-router-link="features"]')).toBeTruthy();
      done();
    });
  });
});
