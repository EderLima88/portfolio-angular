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
    //private apiUrl = '/dados-portfolio.json';
  private apiUrl = 'https://portfolioapi-eder.onrender.com/api/portfolio';
  //Caso o render não esteja mais disponivel, a api local podera ser usada.
  //private apiBackupUrl = './dados-portfolio.json'; 

  carregando = signal<boolean>(true);
  dadosPerfil = signal<any>(null);
  projetos = signal<Projeto[]>([]);
  certificados = signal<Certificado[]>([]);


  carregarTudo() {
    this.carregando.set(true);

    // 2. Pequeno respiro (50ms) para o celular renderizar o Spinner antes da rede travar o processamento
    setTimeout(() => {
      this.ngZone.run(() => {
    this.http.get<any>(this.apiUrl).pipe(
      timeout(8000),
      //Do CELULAR: ele derruma a conexão demorada para a economia de energia
      //Tenta mais 2 vezes, esperando 3 segundos Render API acordar.
      retry({
        count: 5,
      delay: () => timer(4000)
      }),

      // ESTRATÉGIA DE FALLBACK: Se o Render falhar definitivamente (limite atingido),
      // o catchError captura o erro e busca o JSON local automaticamente.
      //catchError((erro) => {
        //console.warn('Conexão com Render falhou ou atingiu limite. Carregando backup local...', erro);
        //return this.http.get<any>(this.apiBackupUrl);
      //}),

      delay(2000)//2s para renderizar o DOM

      ).subscribe({
        next: (resposta) => {
          this.dadosPerfil.set(resposta);
          this.projetos.set(resposta.projetos);
          this.certificados.set(resposta.certificados);

          // Spinner desliga
          this.carregando.set(false); 
      },
      error: (err) => {
      console.error('Erro ao ler o arquivo dados-portifolio.json:', err);
      this.carregando.set(false); 
    }
    });
  });
  },50);
}
}