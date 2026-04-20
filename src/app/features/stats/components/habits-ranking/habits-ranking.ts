import { Component, Input } from '@angular/core';
import { HabitRanking } from '../../models/stats.model';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-habits-ranking',
    imports: [CommonModule],
    templateUrl: './habits-ranking.html',
    styleUrl: './habits-ranking.scss',
})
export class HabitsRanking {
    @Input() rankings: HabitRanking[] = [];

    constructor(private sanitizer: DomSanitizer) { }

    getIconSvg(icono: string): SafeHtml {
        const iconMap: Record<string, string> = {
            'person': '<circle cx="12" cy="8" r="5"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>',
            'circle-user-round': '<circle cx="12" cy="8" r="5"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>',
            'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
            'book': '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
            'droplet': '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
            'dumbbell': '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
            'bed': '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
        };

        const svgPath = iconMap[icono] || iconMap['person'];
        const fullSvg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           class="w-5 h-5"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="2"
           stroke-linecap="round"
           stroke-linejoin="round">
        ${svgPath}
      </svg>
    `;
        return this.sanitizer.bypassSecurityTrustHtml(fullSvg);
    }
}
