import { Component } from '@angular/core';
import { FenService } from '../fen.service';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.css']
})
export class GameInfoComponent {
  constructor(public fenService: FenService) { }
}
