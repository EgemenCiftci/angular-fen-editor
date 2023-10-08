import { Component } from '@angular/core';
import { FenService } from './fen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular FEN Editor';

  constructor(public fenService: FenService) {
    this.fenService.fen =
      'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2';
  }
}
