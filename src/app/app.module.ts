import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { WorldComponent } from './world/world.component';
import { CaveLoaderService } from './caveloader.service';

@NgModule({
  declarations: [
    AppComponent,
    WorldComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [CaveLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
