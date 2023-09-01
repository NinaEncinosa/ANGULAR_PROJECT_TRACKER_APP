import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MaterialModule } from './modules/material/material.module';
import { PresentationModule } from './modules/presentation/presentation.module';
import { CoreModule } from './modules/presentation/core/core.module';
import { ViewsModule } from './modules/presentation/views/views.module';
import { AuthInterceptor } from './modules/api-rest/interceptos/auth.interceptor';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { NgChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';


registerLocaleData(localeEsAr, 'es-AR');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient]
      }
    }),
    PresentationModule,
    CoreModule, 
    BreadcrumbModule,
    NgChartsModule,
    NgxChartsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-AR' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    BreadcrumbService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
