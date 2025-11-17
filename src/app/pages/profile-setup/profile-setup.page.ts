import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RELATIONSHIP_TYPE_LABELS, RelationshipType, UserProfile } from '../../core/models';
import { StorageService } from '../../core/services';
import { CupidToolbarComponent } from '../../../components/cupid/toolbar/cupid-toolbar.component';
import { CupidCardComponent } from '../../../components/cupid/card/cupid-card.component';
import { CupidButtonComponent } from '../../../components/cupid/button/cupid-button.component';

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.page.html',
  styleUrls: ['./profile-setup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonInput,
    IonSelect,
    IonSelectOption,
    CupidToolbarComponent,
    CupidCardComponent,
    CupidButtonComponent
  ]
})
export class ProfileSetupPage implements OnInit {
  form = this.fb.group({
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    relationshipType: [RelationshipType.CELIBATAIRE, Validators.required]
  });

  relationshipLabels = RELATIONSHIP_TYPE_LABELS;
  relationshipTypes = Object.values(RelationshipType);

  saving = false;
  existingProfile?: UserProfile | null;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.existingProfile = await this.storageService.getUserProfile();
    if (this.existingProfile) {
      this.form.patchValue({
        prenom: this.existingProfile.prenom || '',
        relationshipType: this.existingProfile.relationshipType
      });
    }
  }

  async saveProfile(): Promise<void> {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const now = new Date();
    const createdAt = this.existingProfile?.createdAt ? new Date(this.existingProfile.createdAt) : now;
    const profile: UserProfile = {
      prenom: this.form.value.prenom?.trim(),
      relationshipType: this.form.value.relationshipType!,
      createdAt,
      updatedAt: now
    };

    await this.storageService.saveUserProfile(profile);
    this.saving = false;
    this.router.navigate(['/quiz']);
  }

}
