import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { LanguageBadgeComponent } from './components/language-badge/language-badge.component';
import { GestureCardComponent } from './components/gesture-card/gesture-card.component';
import { ChartComponent } from './components/chart/chart.component';

// Importer NgChartsModule pour les graphiques
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    LanguageBadgeComponent,
    GestureCardComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    LanguageBadgeComponent,
    GestureCardComponent,
    ChartComponent
  ]
})
export class SharedModule { }