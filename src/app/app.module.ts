import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


/*

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import * as THREE from 'three';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
    scene;
    camera;
    constructor () {
        // Creating a Scene;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 10000);
        this.camera.position.z = 1000;

        // Adding a cube:
        const geometry = new THREE.BoxGeometry(200, 200, 200);
        const material =  new THREE.MeshPhongMaterial( color: 0x0033ff );
        this.mesh = new THREE.Mesh(geometry, material);

        this.scene.add(this.mesh);


        // Adding a texture:
        //const material =  new THREE.MeshPhongMaterial( map: THREE.ImageUtils.loadTexture('images/crate.jpg') );
    }

 }


 */
