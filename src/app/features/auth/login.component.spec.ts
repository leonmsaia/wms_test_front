import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';
import { ApplicationConfig } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]) as unknown as ApplicationConfig
      ]
    }).compileComponents();
  });

  it('should create and render form controls', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    const pwdInput   = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    expect(emailInput).toBeTruthy();
    expect(pwdInput).toBeTruthy();
  });

  it('should have submit button disabled when form invalid', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBeTrue();
  });
});
