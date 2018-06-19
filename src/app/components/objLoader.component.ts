import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
// import * as OBJLoader from 'three/examples/js/loaders/OBJLoader';
// import * as MTLLoader from 'three/examples/js/loaders/MTLLoader';
// import MTLLoader from 'three-mtl-loader';
 import * as OBJLoader from 'three-obj-loader';
 OBJLoader(THREE);
import * as MTLLoader from 'three-mtl-loader';

// import { OBJLoader } from 'three';
// import { MTLLoader } from 'three';

@Component({
  selector: 'app-objloader',
  template: `
  <div #rendererContainer>
  </div>
  rotation_x: <input [(ngModel)]="testvalue.rotation.x"  required>
  rotation_y: <input [(ngModel)]="testvalue.rotation.y"  required>
  rotation_z: <input [(ngModel)]="testvalue.rotation.z"  required>
  position_x: <input [(ngModel)]="testvalue.position.x"  required>
  position_y: <input [(ngModel)]="testvalue.position.y"  required>
  position_z: <input [(ngModel)]="testvalue.position.z"  required>
  scale: <input [(ngModel)]="testvalue.scale"  required>
  <button  (click)="setValue()" >set</button>


  <button  (click)="startAnim()" >start animate</button>
  `,
  styleUrls: []
})
export class ObjLoaderSampleComponent implements OnInit, AfterViewInit  {
    @ViewChild('rendererContainer') rendererContainer: ElementRef;
    THREE;
    renderer; // = new THREE.WebGLRenderer({ alpha: true }); // background alpha
    scene = null;
    camera = null;
    materials = null;
    // positon = null;
    // height = [0, 0];
    // height_step = 1.5;
    // max_height: number;
    scale: [number, number] ; // 주사위 스케일
    scale_min_limit: number; // 주사위 스케일 최소
    scale_max_limit: number; // 주사위 스케일 최대
    dice_direction = ['up', 'up']; // 주사위 방향

    speed: number; // 0.01
    final_speed: number; // 주사위 결과에서의 속도
    scale_step: number; // 0.02
    bound_time: [number, number]; // 주사위 바운드 숫자 : 2번 바운드 후 바닥에 않을 때 실제 좌표입력

    result_dice: [number, number];
    random_start_angle = [0, 1, 2, 3];

    result_dice_degree = [
            [0, 0],
            [0, Math.PI * 90 / 180], // 1
            [Math.PI * 90 / 180, 0], // 2
            [Math.PI * 270 / 180, 0], // 3
            [0, Math.PI * 270 / 180], // 4     0 : 0, 90: 1.57, 180: 3. 14, 270: 4.71, 360: 6.28
            [Math.PI, 0], // 5
            [0, 0] // 6

        ];
    mod = (Math.PI * 2); // 6.283185307179586

    diceStartanimation = [null, null];
    diceEndanimation = [null, null];


    testvalue = {rotation: {x: 0, y: 0, z: 0}, position: {x: 0, y: 0, z: 0}, scale: 1};

    diceObject = {0: null, 1: null};


    // random_start_angle = [0, Math.PI * 90, Math.PI * 180, Math.PI * 270];
    constructor() {
        this.THREE = THREE;
    }

    ngOnInit() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true }); // background alpha
        this.scene = new this.THREE.Scene();

        // 위치
        // this.positon = new THREE.Vector3( 0, 1, 0 );
        // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
        // https://www.jonathan-petitcolas.com/2013/04/02/create-rotating-cube-in-webgl-with-threejs.html
        // this.camera = new THREE.PerspectiveCamera(75, 450 / 220, 1, 10000);
        this.camera = new this.THREE.PerspectiveCamera(75, 450 / 220, 1, 10000);
        // this.camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 10000);
        this.camera.position.z = 1000; // 1000
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        // this.camera.position.set(600, 600, 1000);
        const light = new this.THREE.DirectionalLight( 0xffffff ); // ( 0xffffff );
        // const light = new THREE.DirectionalLight( 0xffff00 );
        light.position.set( 0, 1, 1 ).normalize();
        this.scene.add(light);

        this.createDiceObject(0, function() {
            this.diceObject[0].position.set(-100, 100, 0);
        }.bind(this));
        this.createDiceObject(1, function() {
            this.diceObject[1].position.set(100, -100, 0);

        }.bind(this));

    }

    createDiceObject(num, callback) {
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath('./assets/');
        mtlLoader.load('dice.mtl', function(materials) {

            materials.preload();
            const objLoader = new this.THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('./assets/');

            objLoader.load('dice.obj', function(object) {
                this.diceObject[num] =  this.unitize (object, 100);
                this.scene.add (this.diceObject[num]);
                callback();
            }.bind(this), this.onProgress, this.onError);

        }.bind(this));
    }

    ngAfterViewInit() {
        // this.renderer.setSize(450, 220); // 450, 220 600, 400
        this.renderer.setSize(450, 220); // 450, 220 600, 400
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.margin = 'auto';
        this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    }

    dice_init() {

        console.log('dice_init start..');
        // this.height = [0, 0];
        // this.max_height = 250;
        this.scale_min_limit = 1; // 주사위 스케일 최소
        this.scale_max_limit = 2; // 주사위 스케일 최대
        this.dice_direction = ['up', 'up']; // 주사위 방향
        this.speed = 0.07; // 0.01
        this.final_speed = 0.05;
        this.scale_step = 0.005; // 0.02
        this.bound_time = [0, 0]; // 주사위 바운드 숫자 : 2번 바운드 후 바닥에 않을 때 실제 좌표입력

        this.scale = [this.scale_min_limit, this.scale_min_limit];
    } // dice_init() {

    onProgress() {

    }
    onError() {

    }


    unitize (object: any, targetSize: any)  {
        // find bounding box of 'object'
        const box3 = new THREE.Box3();
        box3.setFromObject (object);
        const size = new THREE.Vector3();
        size.subVectors (box3.max, box3.min);
        const center = new THREE.Vector3();
        center.addVectors(box3.max, box3.min).multiplyScalar (1);

        // uniform scaling according to objSize
        const objSize = Math.max (size.x, size.y, size.z);
        const scaleSet = targetSize / objSize;

        const theObject =  new THREE.Object3D();
        theObject.add (object);
        object.scale.set (scaleSet, scaleSet, scaleSet);
        // console.log('position');
        // console.log( (-center.x * scaleSet) + ', ' + (-center.y * scaleSet + size.y / 2 * scaleSet) + ', ' + (-center.z * scaleSet));
        // object.position.set (-center.x * scaleSet, -center.y * scaleSet + size.y / 2 * scaleSet, -center.z * scaleSet);
        object.position.set (0, 0, 0);
        return theObject;
    }

    animate(mesh, num) {
        this.diceStartanimation[num] = requestAnimationFrame(() => this.animate(mesh, num));
        mesh.rotation.x += this.speed * 3;
        mesh.rotation.y += this.speed * 2;
        // mesh.position.setY(height); // 높이 값을 변경한다.

        if (this.dice_direction[num] === 'up') {
            this.scale[num]  += this.scale_step;
            // this.height[num] += this.height_step;

            if (this.scale[num] >= this.scale_max_limit ) {
                this.dice_direction[num] = 'down';
            }
        } else {
            this.scale[num]  -= this.scale_step;
            // this.height[num] -= this.height_step;
            if (this.scale[num] <= this.scale_min_limit ) {
                if (this.bound_time[num] === 2) {
                    cancelAnimationFrame(this.diceStartanimation[num]);
                    this.animate_result(mesh, num);
                }
                this.scale_max_limit =  this.scale_max_limit / 1.4;
                this.dice_direction[num] = 'up';
                this.bound_time[num] ++;
            }
        }


        mesh.scale.set(this.scale[num], this.scale[num], this.scale[num]);
        this.renderer.render(this.scene, this.camera);
    }


    animate_result(mesh, num) {
        let stop_x = false;
        let stop_y = false;

        this.diceEndanimation[num] = window.requestAnimationFrame(() => this.animate_result(mesh, num));
            // Pi는 3.14이므로
            const result_dice = this.result_dice[num];

            if (stop_x === false) {
                if ( Math.abs( this.result_dice_degree[result_dice][0] - mesh.rotation.x % this.mod ) > 0.1 ) {

                    mesh.rotation.x += this.final_speed; // 돌아가는 속도를 줄인다.
                } else {
                    mesh.rotation.x = this.result_dice_degree[result_dice][0];
                    stop_x = true;
                }
            }
            if (stop_y === false) {
                if ( Math.abs(this.result_dice_degree[result_dice][1] - mesh.rotation.y % this.mod) > 0.1) {
                    mesh.rotation.y += this.final_speed; // 돌아가는 속도를 줄인다.
                } else {
                    mesh.rotation.y = this.result_dice_degree[result_dice][1];
                    stop_y = true;
                }
            }

            if (stop_x && stop_y) {
                cancelAnimationFrame(this.diceEndanimation[num]);
                // 종료
                // this.eventSvc.sendMessage({key: 'gameStatus', value: 'ready'});
            }
          mesh.scale.set(this.scale[num], this.scale[num], this.scale[num]);
          this.renderer.render(this.scene, this.camera);
    }


     public startAnim() {
        this.result_dice = [2, 5];
        this.dice_init();
        this.animate(this.diceObject[0], 0);
        this.animate(this.diceObject[1], 1);
    }

    public setValue() {
        console.log('x: ' + this.diceObject[0].rotation.x);
        console.log('y: ' + this.diceObject[0].rotation.y);
        console.log('z: ' + this.diceObject[0].rotation.z);
        console.log(this.diceObject[0]);

        this.diceObject[0].rotation.x = this.testvalue.rotation.x;
        this.diceObject[0].rotation.y = this.testvalue.rotation.y;
        this.diceObject[0].rotation.z = this.testvalue.rotation.z;
        this.diceObject[0].position.set(this.testvalue.position.x, this.testvalue.position.y, this.testvalue.position.z);
        this.diceObject[0].scale.set(this.testvalue.scale, this.testvalue.scale, this.testvalue.scale);

        this.renderer.render(this.scene, this.camera);
    }
}
