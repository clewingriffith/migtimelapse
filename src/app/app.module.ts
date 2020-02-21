import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { WorldComponent } from './world/world.component';
import { CaveLoaderService } from './caveloader.service';
import { DEMLoaderService } from './demloader.service';
import { SlideshowComponent } from './slideshow/slideshow.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldComponent,
    SlideshowComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [CaveLoaderService, DEMLoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
