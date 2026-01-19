import { Injectable, signal } from '@angular/core';

export interface ToastAction {
    label: string;
    onClick: () => void;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    title = signal<string | null>(null);
    message = signal<string | null>(null);
    isVisible = signal<boolean>(false);
    action = signal<ToastAction | null>(null);

    private timeoutId: any;

    show(title: string, message: string, duration: number = 3000, action?: ToastAction) {
        this.title.set(title);
        this.message.set(message);
        this.action.set(action || null);
        this.isVisible.set(true);

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            this.hide();
        }, duration);
    }

    hide() {
        this.isVisible.set(false);
        // Optional: clear message after animation for cleaner DOM, but visibility toggle is enough
    }
}
