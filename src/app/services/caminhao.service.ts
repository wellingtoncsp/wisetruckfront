import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Caminhao, CaminhaoFiltro, CaminhaoPayload } from '../models/caminhao.model';
import { environment } from '../../environments/environment';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class CaminhaoService {
  private apiUrl = `${environment.apiUrl}/Caminhao`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private cacheKeys = {
    allCaminhoes: 'all-caminhoes',
    disponiveis: 'caminhoes-disponiveis',
    caminhao: (id: number) => `caminhao-${id}`
  };

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  getCaminhoes(): Observable<Caminhao[]> {
    // Verificar se temos dados em cache
    const cachedData = this.cacheService.get('all-caminhoes');
    if (cachedData) {
      return of(cachedData);
    }
    
    // Se não temos cache, fazer a requisição
    return this.http.get<Caminhao[]>(this.apiUrl).pipe(
      tap(data => {
        this.cacheService.set('all-caminhoes', data);
      }),
      catchError(error => {
        console.error('Erro ao obter caminhões:', error);
        return of([]); // Retornar array vazio em caso de erro
      })
    );
  }

  getCaminhao(id: number): Observable<Caminhao> {
    // Verificar se temos dados em cache
    const cacheKey = this.cacheKeys.caminhao(id);
    const cachedData = this.cacheService.get(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }
    
    return this.http.get<Caminhao>(`${this.apiUrl}/${id}`).pipe(
      tap(data => {
        this.cacheService.set(cacheKey, data);
      })
    );
  }

  getCaminhoesDisponiveis(): Observable<Caminhao[]> {
    const cachedData = this.cacheService.get(this.cacheKeys.disponiveis);
    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<Caminhao[]>(`${this.apiUrl}/disponiveis`).pipe(
      tap(data => {
        this.cacheService.set(this.cacheKeys.disponiveis, data);
      })
    );
  }

  createCaminhao(caminhao: Caminhao): Observable<Caminhao> {
    const payload = this.formatPayload(caminhao);
    
    return this.http.post<Caminhao>(this.apiUrl, payload, this.httpOptions).pipe(
      tap(() => {
        // Limpar cache após criação
        this.invalidateCache();
      })
    );
  }

  updateCaminhao(id: number, caminhao: Caminhao): Observable<Caminhao> {
    try {
      const payload = this.formatPayload({
        ...caminhao,
        id: id
      });

      console.log('Enviando PUT para:', `${this.apiUrl}/${id}`);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      return this.http.put<Caminhao>(
        `${this.apiUrl}/${id}`,
        payload,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        }
      ).pipe(
        tap(() => {
          this.invalidateCache();
          this.cacheService.clear(`caminhao-${id}`);
        }),
        catchError(error => {
          console.error('Erro detalhado ao atualizar:', {
            status: error.status,
            message: error.message,
            error: error.error,
            payload: payload
          });
          throw error;
        })
      );
    } catch (error) {
      console.error('Erro ao formatar payload:', error);
      return throwError(() => new Error('Erro ao formatar dados do caminhão'));
    }
  }

  deleteCaminhao(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Limpar cache após exclusão
        this.invalidateCache();
        this.cacheService.clear(this.cacheKeys.caminhao(id));
      })
    );
  }

  // Função auxiliar para formatar o payload antes de enviar
  private formatPayload(caminhao: Caminhao): CaminhaoPayload {
    // Criar um novo objeto com apenas os campos necessários na ordem correta
    const payload = {
      id: caminhao.id,
      modelo: caminhao.modelo.trim(),
      placa: caminhao.placa.trim().toUpperCase(),
      dataFabricacao: '',
      status: caminhao.status || 'Disponível'
    } as CaminhaoPayload;

    // Formatar a data
    if (caminhao.dataFabricacao) {
      let date: Date;
      
      if (typeof caminhao.dataFabricacao === 'string') {
        date = new Date(caminhao.dataFabricacao);
      } else {
        date = caminhao.dataFabricacao;
      }

      // Ajustar para UTC para evitar problemas com timezone
      const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ));
      
      payload.dataFabricacao = utcDate.toISOString().split('T')[0];
    }

    // Validar campos obrigatórios
    if (!payload.modelo || !payload.placa || !payload.dataFabricacao) {
      throw new Error('Campos obrigatórios faltando');
    }

    // Garantir que o status seja válido
    if (!['Disponível', 'Em Viagem', 'Em Manutenção'].includes(payload.status)) {
      payload.status = 'Disponível';
    }

    // Se o ID for 0 ou undefined, remover do payload
    if (!payload.id || payload.id === 0) {
      delete payload.id;
    }

    console.log('Payload formatado:', JSON.stringify(payload, null, 2));
    return payload;
  }

  // Limpa toda a cache relacionada a caminhões
  private invalidateCache(): void {
    this.cacheService.clear(this.cacheKeys.allCaminhoes);
    this.cacheService.clear(this.cacheKeys.disponiveis);
  }

  getCaminhoesPaginados(page: number = 0, size: number = 10): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&size=${size}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        // Armazenar em cache apenas os itens desta página
        const cacheKey = `caminhoes-page-${page}-size-${size}`;
        this.cacheService.set(cacheKey, response, 2 * 60 * 1000); // 2 minutos
        return response;
      })
    );
  }

  forceRefreshCaminhoes(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(this.apiUrl).pipe(
      tap((data: Caminhao[]) => {
        this.cacheService.set(this.cacheKeys.allCaminhoes, data);
      })
    );
  }
} 