import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Perfil } from '../../core/services/perfil.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contato.html',
  styleUrls: ['./contato.css']
})
export class ContatoComponent {
  @Input() dados: Perfil | null = null;
}
