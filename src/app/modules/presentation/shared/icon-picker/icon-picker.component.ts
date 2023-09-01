import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent {

  availableIcons: string[] = ['mate', 'hammer-and-pick', 'robot-emoji', 'rocket', 'gem-stone', 'brain-emoji', 'heart', 'smiling-face-with-sunglasses', 'gear', 'construction', 'superhero', 'troll', 'woman-technologist', 'call-me', 'mechanical-arm', 'thumbs-up', 'battery', 'crossed-swords'];
  @Output() iconSelected = new EventEmitter<string>();
  @Input() currentIcon: string = '';

  selectIcon(icon: string): void {
    this.iconSelected.emit(icon);
  }

}
