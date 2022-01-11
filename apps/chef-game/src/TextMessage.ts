import { ACTION_KEY } from './keybindings';
import { RevealingText } from './RevealingText';
import './styles/TextMessage.css';
import { KeyPressListener } from './utils';

export interface TextMessageConfig {
   text: string;
   onComplete: Function;
}

export class TextMessage {
   text: string;
   onComplete: Function;
   element: HTMLElement | null = null;
   actionListener?: KeyPressListener;
   revealingText: RevealingText | null = null;

   constructor({ text, onComplete }: TextMessageConfig) {
      this.text = text;
      this.onComplete = onComplete;
   }

   createElement() {
      this.element = document.createElement('div');
      this.element.classList.add('TextMessage');

      this.element.innerHTML = /*html*/ `
        <p class="TextMessage_p"></p>
        <button class="TextMessage_button">Next</button>
      `;

      this.revealingText = new RevealingText({
         element: this.element.querySelector('.TextMessage_p')!,
         text: this.text
      });

      this.element.querySelector('button')?.addEventListener('click', () => this.done());

      this.actionListener = new KeyPressListener(ACTION_KEY, () => {
         this.done();
      });
   }

   done() {
      if (this.revealingText?.isDone) {
         this.element?.remove();
         this.actionListener?.unbind();
         this.onComplete();
      } else {
         this.revealingText?.warpToDone();
      }
   }

   init(container: HTMLElement) {
      this.createElement();
      container.appendChild(this.element!);
      this.revealingText?.init();
   }
}
