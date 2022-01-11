export interface RevealConfig {
   element: HTMLElement;
   text: string;
   speed?: number;
}

export class RevealingText {
   element: HTMLElement;
   text: string;
   speed: number;

   timeout?: number;
   isDone: boolean = false;

   constructor(config: RevealConfig) {
      this.element = config.element;
      this.text = config.text;
      this.speed = config.speed || 70;
   }

   revealOneCharacter(chars: { span: HTMLElement; delayAfter: number }[]) {
      const next = chars.splice(0, 1)[0];
      next.span.classList.add('revealed');
      if (chars.length > 0) {
         this.timeout = setTimeout(() => {
            this.revealOneCharacter(chars);
         }, next.delayAfter);
      } else {
         this.isDone = true;
      }
   }

   warpToDone() {
      clearTimeout(this.timeout);
      this.isDone = true;
      this.element.querySelectorAll('span').forEach(s => s.classList.add('revealed'));
   }

   init() {
      let chars: { span: HTMLElement; delayAfter: number }[] = [];
      this.text.split('').forEach(char => {
         let span = document.createElement('span');
         span.textContent = char;
         this.element.appendChild(span);

         chars.push({ span, delayAfter: char === ' ' ? 0 : this.speed });
      });

      this.revealOneCharacter(chars);
   }
}
