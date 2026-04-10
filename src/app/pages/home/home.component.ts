import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TypewriterComponent } from '../../shared/components/typewriter/typewriter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TypewriterComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
