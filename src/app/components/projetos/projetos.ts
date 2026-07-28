import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Projeto } from '../../core/services/perfil.service';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projetos.html',
  styleUrls: ['./projetos.css']
})
export class ProjetosComponent {
  @Input() listaProjetos: Projeto[] = [];
}
