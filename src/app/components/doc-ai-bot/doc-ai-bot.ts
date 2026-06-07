import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-doc-ai-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doc-ai-bot.html',
  styleUrl: './doc-ai-bot.css'
})
export class DocAiBotComponent implements AfterViewChecked {
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  isOpen = false;
  userInput = '';
  messages: ChatMessage[] = [];
  selectedMode = 'help';
  selectedModel = 'groq';
  isLoading = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  closeChat() {
    this.isOpen = false;
  }

  setQuickAction(actionText: string) {
    this.userInput = actionText;
    this.sendMessage();
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const query = this.userInput.trim();
    this.messages = [...this.messages, { role: 'user', content: query }];
    this.userInput = '';
    this.isLoading = true;

    const payload = {
      user_input: query,
      mode: this.selectedMode,
      project_id: 'freightship',
      model: this.selectedModel,
      document: ''
    };

    // Make POST request to the local agent/generate API
    this.http.post<any>(`${environment.aiServerUrl}/agent/generate`, payload).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          if (res && res.response) {
            this.messages = [...this.messages, { role: 'assistant', content: res.response }];
          } else {
            this.messages = [...this.messages, { role: 'assistant', content: 'An unexpected response was received.' }];
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error generating response:', err);
          this.messages = [...this.messages, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }];
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  parseMarkdown(text: string): string {
    if (!text) return '';
    let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    parsed = parsed.replace(/\n/g, '<br>');
    return parsed;
  }
}
