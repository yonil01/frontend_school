import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvServiceProvider } from '@app/core/services/env/env.service.provider';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LookAndFeelService {
  constructor(private _httpClient: HttpClient) {}

  /*getLookAndFeelConfig() {
    const url = EnvServiceProvider.useFactory().REST_API + '/api/v1/laf';
    return this._httpClient.get(url).pipe(map((res) => res));
  }*/
}
