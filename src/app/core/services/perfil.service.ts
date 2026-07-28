import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  dadosPerfil = signal<Perfil | null>(null);
  projetos = signal<Projeto[]>([]);
  certificados = signal<Certificado[]>([]);

  carregarTudo() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (resposta) => {
        this.dadosPerfil.set(resposta);
        this.projetos.set(resposta.projetos);
        this.certificados.set(resposta.certificados);
      },
      error: (err) => console.error('Erro ao ler o arquivo dados-portifolio.json:', err)
    });
  }
}
