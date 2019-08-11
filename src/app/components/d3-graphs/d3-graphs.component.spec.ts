import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GraphsComponent } from './d3-graphs.component';

describe('D3GraphsComponent', () => {
  let component: D3GraphsComponent;
  let fixture: ComponentFixture<D3GraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3GraphsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
