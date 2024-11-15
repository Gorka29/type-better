import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { phrases } from '../phrases';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-typing-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './typing-practice.component.html',
  styleUrl: './typing-practice.component.scss'
})
export class TypingPracticeComponent implements OnInit, AfterViewInit {

  @ViewChild('inputField') inputField!: ElementRef;
  phrases: string[] = phrases;
  currentPhrase: string = '';
  userInput: string = '';
  showNotification: boolean = false;
  isSuccess: boolean | null = false;
  notificationMessage: string = '';
  wpm: number = 0;
  accuracy: number = 0;
  startTime: number | null = null;
  totalKeystrokes: number = 0;
  correctKeystrokes: number = 0;
  isCompleted: boolean = false;
  private correctSound: HTMLAudioElement;
  private errorSound: HTMLAudioElement;
  private soundsLoaded: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    // Inicializar los sonidos
    this.correctSound = new Audio('/assets/sounds/type.mp3');
    this.errorSound = new Audio('/assets/sounds/error.mp3');

    // Configurar volumen
    this.correctSound.volume = 0.2;
    this.errorSound.volume = 0.3;

    // Verificar que los sonidos se carguen correctamente
    Promise.all([
      this.correctSound.load(),
      this.errorSound.load()
    ]).then(() => {
      console.warn('Sonidos cargados correctamente');
      this.soundsLoaded = true;
    }).catch(error => {
      console.error('Error cargando los sonidos:', error);
      this.soundsLoaded = false;
    });
  }

  ngOnInit() {
    this.setNewPhrase();
  }

  setNewPhrase() {
    const randomIndex = Math.floor(Math.random() * this.phrases.length);
    this.currentPhrase = this.phrases[randomIndex];
  }

  playSound(isCorrect: boolean) {
    if (!this.soundsLoaded) return;

    try {
      const sound = isCorrect ? this.correctSound : this.errorSound;
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.error('Error reproduciendo el sonido:', error);
      });
    } catch (error) {
      console.error('Error en playSound:', error);
    }
  }

  checkInput() {
    if (!this.startTime) {
      this.startTime = Date.now();
    }

    const currentIndex = this.userInput.length - 1;
    if (currentIndex >= 0) {
      const isCorrect = this.userInput[currentIndex] === this.currentPhrase[currentIndex];

      // Usar el nuevo método playSound
      this.playSound(isCorrect);

      if (isCorrect) {
        this.correctKeystrokes++;
      }

      this.totalKeystrokes++;
      this.accuracy = (this.correctKeystrokes / this.totalKeystrokes) * 100;
    }

    // Calcular WPM
    const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // tiempo en minutos
    const wordsTyped = this.userInput.length / 5; // consideramos 5 caracteres como una palabra
    this.wpm = Math.round(wordsTyped / timeElapsed);

    // Verificar si completó la frase
    if (this.userInput.length === this.currentPhrase.length) {
      this.isCompleted = true;
      const accuracyPercentage = (this.correctKeystrokes / this.totalKeystrokes) * 100;
      if (accuracyPercentage <= 30) {
        this.isSuccess = false; // Rojo
      } else if (accuracyPercentage > 30 && accuracyPercentage < 75) {
        this.isSuccess = null; // Naranja
      } else {
        this.isSuccess = true; // Verde
      }
      this.showNotification = true;
      this.notificationMessage = this.isSuccess
        ? '¡Excelente! Has completado el texto correctamente'
        : 'Has completado el texto con errores';
    }
  }

  retry() {
    // Reiniciar todo
    this.isCompleted = false;
    this.userInput = '';
    this.startTime = null;
    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.wpm = 0;
    this.accuracy = 0;
    this.showNotification = false;
    this.isSuccess = false;
    this.notificationMessage = '';
    this.setNewPhrase();

    // Forzar la detección de cambios y luego establecer el foco
    this.cdr.detectChanges();
    requestAnimationFrame(() => {
      if (this.inputField?.nativeElement) {
        this.inputField.nativeElement.focus();
      }
    });
  }

  getAbsoluteIndex(wordIndex: number, charIndex: number): number {
    let absoluteIndex = 0;
    const words = this.currentPhrase.split(' ');

    // Suma la longitud de las palabras anteriores más los espacios
    for (let i = 0; i < wordIndex; i++) {
      absoluteIndex += words[i].length + 1; // +1 por el espacio
    }

    return absoluteIndex + charIndex;
  }

  ngAfterViewInit() {
    this.inputField.nativeElement.focus();
  }

}
