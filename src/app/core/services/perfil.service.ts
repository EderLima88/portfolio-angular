import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { delay } from 'rxjs/operators';

export interface Perfil {
  nome: string; cargo: string; formacao: string; resumo: string;
  linkLinkedin: string; linkGithub: string; email: string; telefone: string;
}

export interface Projeto {
  titulo: string; descricao: string; tags: string[]; linkGithub: string;
}

export interface Certificado {
  nome: string; emissor: string; ano: number; url: string;
}

interface RespostaPortfolio {
  perfil: Perfil;
  projetos: Projeto[];
  certificados: Certificado[];
}

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private http = inject(HttpClient);
  //private apiUrl = '/dados-portfolio.json';
  private apiUrl = 'https://portfolioapi-eder.onrender.com/api/portfolio';

  carregando = signal<boolean>(true);
  dadosPerfil = signal<any>(null);
  projetos = signal<Projeto[]>([]);
  certificados = signal<Certificado[]>([]);

  carregarTudo() {
this.carregando.set(true);

    this.http.get<any>(this.apiUrl).pipe(delay(4000)).subscribe({
      next: (resposta) => {
        this.dadosPerfil.set(resposta);
        this.projetos.set(resposta.projetos);
        this.certificados.set(resposta.certificados);

// Só desliga o Spinner após o término dos 4 segundos de atraso
        this.carregando.set(false);

      },
      error: (err) => console.error('Erro ao ler o arquivo dados-portifolio.json:', err)
    });
  }
}
