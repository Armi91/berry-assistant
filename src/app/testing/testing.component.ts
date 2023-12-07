import { Component } from '@angular/core';
import { TestingService } from '../testing.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styles: [],
})
export class TestingComponent {
  constructor(public test: TestingService) {}
}
