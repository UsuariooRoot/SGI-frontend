import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface KnowledgeCard {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  autor: string;
  categoria: string;
}

@Component({
  selector: 'app-knowledge-card',
  imports: [CommonModule],
  templateUrl: './knowledge-card.component.html',
  styleUrl: './knowledge-card.component.scss'
})
export class KnowledgeCardComponent {

  @Input({required: true}) knowledgeCard!: KnowledgeCard;

  verDetalle() {
    console.log('Ver detalle');
  }

}
