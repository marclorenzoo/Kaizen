import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDock } from './mobile-dock';

describe('MobileDock', () => {
  let component: MobileDock;
  let fixture: ComponentFixture<MobileDock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileDock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileDock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
