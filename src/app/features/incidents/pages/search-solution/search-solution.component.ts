import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { KnowledgeCardComponent } from '@features/incidents/components/knowledge-card/knowledge-card.component';
import { MOCK_KNOWLEDGE_CARDS } from '@features/incidents/data/search-solution';

@Component({
  selector: 'app-search-solution',
  imports: [KnowledgeCardComponent, MatIconModule],
  templateUrl: './search-solution.component.html',
  styleUrl: './search-solution.component.scss'
})
export class SearchSolutionComponent {

  knowledgeCards = MOCK_KNOWLEDGE_CARDS;

}
