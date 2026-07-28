import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilService } from './core/services/perfil.service';

import { ProjetosComponent } from './components/projetos/projetos'; 
import { CertificadosComponent } from './components/certificados/certificados'; 
import { ContatoComponent } from './components/contato/contato';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProjetosComponent, CertificadosComponent, ContatoComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  perfilService = inject(PerfilService);
  abaAtiva: 'projetos' | 'certificados' | 'contato' | '' = '';

  ngOnInit() {
    this.perfilService.carregarTudo();
  }

  mudarAba(aba: 'projetos' | 'certificados' | 'contato') {
    this.abaAtiva = aba;
  }

  formatarResumo(textoOriginal: string): string {
    if (!textoOriginal) return '';

    //Em negrito são estas
        const palavrasChave = [
      'Sistemas de Informação', 'Shell Scripting', 'APIs RESTful', 
      'Spring Boot', 'Clean Code', 'Angular', 'DevOps', 
      'Docker', 'MySQL', 'React', 'Java', 'REST'
    ];

    let textoFormatado = textoOriginal;

    palavrasChave.forEach(palavra => {
      const expressao = new RegExp(`(${palavra})`, 'gi');
      textoFormatado = textoFormatado.replace(expressao, '<strong>$1</strong>');
    });

    return textoFormatado;
  }

}
