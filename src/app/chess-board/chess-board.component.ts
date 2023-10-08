import { Component } from '@angular/core';
import { FenService } from '../fen.service';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent {
  constructor(public fenService: FenService) { }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: DragEvent) {
    event.preventDefault();
    const fromId = event.dataTransfer?.getData('id');
    const target = event.target as HTMLDivElement;
    if (fromId && target?.classList.contains('chessboard-square')) {
      const fromPiece = document.getElementById(fromId);
      if (fromPiece) {
        const toPiece = target.getElementsByClassName("piece")[0];
        const toId = toPiece.id;
        toPiece.textContent = fromPiece.textContent;
        fromPiece.textContent = '';
        this.fenService.updateFenPieces(Number(fromId), Number(toId));
      }
    }
  }

  drag(event: DragEvent) {
    const target = event.target as HTMLDivElement;
    if (target?.id) {
      event.dataTransfer?.setData('id', target.id);
    }
  }
}
