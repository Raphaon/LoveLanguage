import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CupidButtonComponent } from './cupid-button.component';
import { By } from '@angular/platform-browser';

describe('CupidButtonComponent', () => {
  let component: CupidButtonComponent;
  let fixture: ComponentFixture<CupidButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CupidButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CupidButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders secondary variant', () => {
    component.variant = 'secondary';
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button'));
    expect(button.nativeElement.classList).toContain('ion-color-secondary');
  });

  it('disables when required', () => {
    component.disabled = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button'));
    expect(button.properties['disabled']).toBeTrue();
  });
});
