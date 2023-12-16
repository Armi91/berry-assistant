import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { Chat } from 'src/app/_models/chat';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styles: [
    `
      .pi-send {
        transition: color 0.1s ease-in-out;
        top: auto;
        bottom: 1.2rem;
        &:hover {
          color: var(--primary-color);
        }
      }
      .spinner {
        position: absolute;
        bottom: 1.2rem;
        right: 1rem;
      }
    `,
  ],
})
export class PromptComponent implements OnInit {
  prompt: string = '';

  @Input({required: true}) isSending$!: BehaviorSubject<boolean>;
  @Input({required: true}) clearPrompt$!: BehaviorSubject<boolean>;
  @Input() promptType?: string;
  @Input() showFileUpload?: boolean;
  @Output() onSend: EventEmitter<string> = new EventEmitter();

  constructor(private chat: ChatService) {}

  ngOnInit(): void {
    this.clearPrompt$.subscribe({
      next: (clear) => {
        if (clear) {
          this.prompt = '';
        }
      }
    })
  }

  send(event: KeyboardEvent | null = null) {
    if (event) {
      event.preventDefault();
    }
    if (!this.prompt) {
      return;
    }
    this.isSending$.next(true);
    this.onSend.emit(this.prompt);
  }
}
