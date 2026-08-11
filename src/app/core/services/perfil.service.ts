import { inject, Injectable, signal, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, retry, timer, timeout, catchError } from 'rxjs';

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
  private ngZone = inject(NgZone);
  private apiUrl = 'https://portfolioapi-eder.onrender.com/api/portfolio';
  //Caso o render não esteja mais disponivel, a api local podera ser usada.
  private apiBackupUrl = './dados-portfolio.json'; 

  // carregando = signal<boolean>(true);
  // dadosPerfil = signal<any>(null);
  // projetos = signal<Projeto[]>([]);
  // certificados = signal<Certificado[]>([]);

    carregando = signal<boolean>(true);
  // O Perfil começa como null, pois é um objeto único
  dadosPerfil = signal<Perfil | null>(null);
  // Projetos e Certificados começam como arrays vazios []
  projetos = signal<Projeto[]>([]);
  certificados = signal<Certificado[]>([]);

  carregarTudo() {
    this.carregando.set(true);

    const requisicaoRender = this.http.get<any>(this.apiUrl).pipe(
      timeout(10000),
      retry({
        count: 7,
        delay: () => timer(4000)
      })
    );
    
    requisicaoRender.pipe(
      catchError((err) => {
        console.warn('Render offline ou Timeout. Tentando carregar dados locais...');
        // Busca o JSON local SEM timeout para garantir que ele carregue até o fim
        return this.http.get<any>('./dados-portfolio.json');
      }),
      delay(2000)//2s para renderizar o DOM

      ).subscribe({
        next: (resposta) => {
            if (resposta) {
          this.dadosPerfil.set(resposta);
          this.projetos.set(resposta.projetos ?? []);
          this.certificados.set(resposta.certificados ?? []);
          }
          // Spinner desliga
          this.carregando.set(false); 
      },
      error: (err) => {
      console.error('Erro ao ler o arquivo dados-portifolio.json:', err);
      this.carregando.set(false); 
      }
    });
  }}