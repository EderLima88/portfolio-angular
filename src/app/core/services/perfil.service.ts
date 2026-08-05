import { inject, ChangeDetectorRef, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, retry, timer, timeout } from 'rxjs';

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
  private cdr = inject(ChangeDetectorRef);
  //private apiUrl = '/dados-portfolio.json';
  private apiUrl = 'https://portfolioapi-eder.onrender.com/api/portfolio';

  carregando = signal<boolean>(true);
  dadosPerfil = signal<any>(null);
  projetos = signal<Projeto[]>([]);
  certificados = signal<Certificado[]>([]);


  carregarTudo() {
    this.carregando.set(true);

    this.http.get<any>(this.apiUrl).pipe(
      timeout(8000),
      
      //Do CELULAR: ele derruma a conexão demorada para a economia de energia
      //Tenta mais 2 vezes, esperando 3 segundos Render API acordar.
      retry({
        count: 5,
        delay: () => timer(4000)
      }),

      delay(2000)//2s para renderizar o DOM

      ).subscribe({
        next: (resposta) => {
          this.dadosPerfil.set(resposta);
          this.projetos.set(resposta.projetos);
          this.certificados.set(resposta.certificados);

          // Spinner desliga
          this.carregando.set(false); 
          // Força o navegador a redesenhar a tela
          this.cdr.detectChanges();
     },
      error: (err) => {
      console.error('Erro ao ler o arquivo dados-portifolio.json:', err);
      this.carregando.set(false); 
    }
    });
  }
}
