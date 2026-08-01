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

    this.http.get<any>(this.apiUrl).pipe(delay(2000)
  ).subscribe({
      next: (resposta) => {
        this.dadosPerfil.set(resposta);
        this.projetos.set(resposta.projetos);
        this.certificados.set(resposta.certificados);

// Dá 500ms de folga exclusiva para o navegador renderizar as letras do resumo no DOM
      setTimeout(() => {
        this.carregando.set(false); // Só agora o Spinner sai da tela com segurança!
      }, 500);

      },
      error: (err) => console.error('Erro ao ler o arquivo dados-portifolio.json:', err)
    });
  }
}
