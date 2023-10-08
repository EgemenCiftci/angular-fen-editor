import { Injectable } from '@angular/core';
import { Piece } from './piece';

@Injectable({ providedIn: 'root' })
export class FenService {
  private _fen = '';
  get fen(): string {
    return this._fen;
  }
  set fen(val: string) {
    if (val !== this._fen) {
      this._fen = val;
      this.parseFen(this._fen);
    }
  }

  private _castlingAvailabilityMap = new Map([
    ['K', false],
    ['Q', false],
    ['k', false],
    ['q', false]
  ]);
  pieces: Piece[] = [];

  private _activeColor = '';
  get activeColor(): string {
    return this._activeColor;
  }
  set activeColor(val: string) {
    if (val !== this._activeColor) {
      this._activeColor = val;
      this.updateFenActiveColor(this._activeColor);
    }
  }

  get castlingAvailability0(): boolean {
    return this._castlingAvailabilityMap.get('K') ?? false;
  }
  set castlingAvailability0(val: boolean) {
    if (val !== this._castlingAvailabilityMap.get('K')) {
      this._castlingAvailabilityMap.set('K', val);
      this.updateFenCastlingAvailability(this._castlingAvailabilityMap);
    }
  }

  get castlingAvailability1(): boolean {
    return this._castlingAvailabilityMap.get('Q') ?? false;
  }
  set castlingAvailability1(val: boolean) {
    if (val !== this._castlingAvailabilityMap.get('Q')) {
      this._castlingAvailabilityMap.set('Q', val);
      this.updateFenCastlingAvailability(this._castlingAvailabilityMap);
    }
  }

  get castlingAvailability2(): boolean {
    return this._castlingAvailabilityMap.get('k') ?? false;
  }
  set castlingAvailability2(val: boolean) {
    if (val !== this._castlingAvailabilityMap.get('k')) {
      this._castlingAvailabilityMap.set('k', val);
      this.updateFenCastlingAvailability(this._castlingAvailabilityMap);
    }
  }

  get castlingAvailability3(): boolean {
    return this._castlingAvailabilityMap.get('q') ?? false;
  }
  set castlingAvailability3(val: boolean) {
    if (val !== this._castlingAvailabilityMap.get('q')) {
      this._castlingAvailabilityMap.set('q', val);
      this.updateFenCastlingAvailability(this._castlingAvailabilityMap);
    }
  }

  private _enPassantTargetSquare = '';
  get enPassantTargetSquare(): string {
    return this._enPassantTargetSquare;
  }
  set enPassantTargetSquare(val: string) {
    if (val !== this._enPassantTargetSquare) {
      this._enPassantTargetSquare = val;
      this.updateFenEnPassantTargetSquare(this._enPassantTargetSquare);
    }
  }

  private _halfmoveClock = 0;
  get halfmoveClock(): number {
    return this._halfmoveClock;
  }
  set halfmoveClock(val: number) {
    if (val !== this._halfmoveClock) {
      this._halfmoveClock = val;
      this.updateFenHalfmoveClock(this._halfmoveClock);
    }
  }

  private _fullmoveNumber = 0;
  get fullmoveNumber(): number {
    return this._fullmoveNumber;
  }
  set fullmoveNumber(val: number) {
    if (val !== this._fullmoveNumber) {
      this._fullmoveNumber = val;
      this.updateFenFullmoveNumber(this._fullmoveNumber);
    }
  }

  parseFen(fen: string) {
    if (fen) {
      const isFenValid = this.validateFen(fen);
      if (isFenValid) {
        const parts = fen.split(' ');
        this.pieces = this.parseBoardString(parts[0]);
        this.activeColor = parts[1];
        this.parseCastling([...parts[2]]);
        this.enPassantTargetSquare = parts[3] === '-' ? '' : parts[3];
        this.halfmoveClock = Number(parts[4]);
        this.fullmoveNumber = Number(parts[5]);
      } else {
        this.pieces = [];
        this.activeColor = '';
        for (const key of this._castlingAvailabilityMap.keys()) {
          this._castlingAvailabilityMap.set(key, false);
        }
        this.enPassantTargetSquare = '';
        this.halfmoveClock = 0;
        this.fullmoveNumber = 0;
      }
    }
  }

  private parseBoardString(bs: string): Piece[] {
    const rss = bs.split('/');
    const pieces: Piece[] = [];
    rss.forEach((rs) => {
      pieces.push(...this.parseRowString(rs));
    });
    return pieces;
  }

  private parseRowString(rs: string): Piece[] {
    const pieces: Piece[] = [];
    [...rs].forEach((x) => {
      if (x.match(/\d/)) {
        pieces.push(...Array(Number(x)).fill(new Piece('', false)));
      } else {
        pieces.push(new Piece(x, false));
      }
    });
    return pieces;
  }

  private validateFen(fen: string) {
    const pattern =
      /^([kqrbnpKQRBNP12345678]{1,8}\/){7}[kqrbnpKQRBNP12345678]{1,8}\s[wb]\s(((([kqKQ])(?!\5)){1,4})|-)\s(([a-h][1-8])|-)\s\d+\s[1-9]\d*$/;
    return pattern.test(fen);
  }

  private parseCastling(ca: string[]) {
    for (const key of this._castlingAvailabilityMap.keys()) {
      this._castlingAvailabilityMap.set(key, ca.includes(key));
    }
  }

  private updateFenActiveColor(activeColor: string) {
    const parts = this._fen.split(' ');
    parts[1] = activeColor;
    this._fen = parts.join(' ');
  }

  private updateFenCastlingAvailability(castlingAvailabilityMap: Map<string, boolean>) {
    const parts = this._fen.split(' ');
    parts[2] = Array.from(castlingAvailabilityMap.entries()).filter(f => f[1]).map(f => f[0]).join('');
    if (!parts[2]) {
      parts[2] = '-';
    }
    this._fen = parts.join(' ');
  }

  private updateFenEnPassantTargetSquare(enPassantTargetSquare: string) {
    const parts = this._fen.split(' ');
    parts[3] = enPassantTargetSquare;
    if (!parts[3]) {
      parts[3] = '-';
    }
    this._fen = parts.join(' ');
  }

  private updateFenHalfmoveClock(halfmoveClock: number) {
    const parts = this._fen.split(' ');
    parts[4] = halfmoveClock.toString();
    this._fen = parts.join(' ');
  }

  private updateFenFullmoveNumber(fullmoveNumber: number) {
    const parts = this._fen.split(' ');
    parts[5] = fullmoveNumber.toString();
    this._fen = parts.join(' ');
  }

  updateFenPieces(fromIndex: number, toIndex: number) {
    const fromPiece = this.pieces[fromIndex];
    const toPiece = this.pieces[toIndex];
    this.pieces[fromIndex] = toPiece;
    this.pieces[toIndex] = fromPiece;
    const parts = this._fen.split(' ');
    parts[0] = this.getFen(this.pieces);
    this.fen = parts.join(' ');
  }

  private getFen(pieces: Piece[]): string {
    let fen = '';
    let counter = 0;
    pieces.forEach((f, i) => {
      if (f.letter) {
        if (counter) {
          fen += counter;
          counter = 0;
        }
        fen += f.letter;
      } else {
        counter++;
      }
      if (i % 8 === 7) {
        if (counter) {
          fen += counter;
          counter = 0;
        }
        if (i !== 63) {
          fen += '/';
        }
      }
    });
    return fen;
  }
}
