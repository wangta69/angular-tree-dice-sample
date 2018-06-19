import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-meshphong',
  template: `
  <div #rendererContainer>
  </div>

  height: {{height}}
  <input [(ngModel)]="setXvalue"  required>
  <button  (click)="setValue()" >set</button>


  <button  (click)="startAnim()" >start animate</button>
  `,
  styleUrls: []
})
export class MeshPhongMaterialSampleComponent implements OnInit, AfterViewInit  {
    @ViewChild('rendererContainer') rendererContainer: ElementRef;

    renderer = new THREE.WebGLRenderer({ alpha: true }); // background alpha
    scene = null;
    camera = null;
    mesh1 = null;
    mesh2 = null;
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
            [0, Math.PI * 270 / 180], // 0 : 0, 90: 1.57, 180: 3. 14, 270: 4.71, 360: 6.28
            [0, Math.PI * 90 / 180],
            [Math.PI * 90 / 180, 0],
            [Math.PI * 270 / 180, 0],
            [0, 0],
            [Math.PI, 0]
        ];
    mod = (Math.PI * 2); // 6.283185307179586

    diceStartanimation = [null, null];
    diceEndanimation = [null, null];

    setXvalue = 0;

    // random_start_angle = [0, Math.PI * 90, Math.PI * 180, Math.PI * 270];
    constructor() {

    }

    ngOnInit() {

        this.scene = new THREE.Scene();

        // 위치
        // this.positon = new THREE.Vector3( 0, 1, 0 );
        // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
        // https://www.jonathan-petitcolas.com/2013/04/02/create-rotating-cube-in-webgl-with-threejs.html
        this.camera = new THREE.PerspectiveCamera(30, 450 / 220, 1, 10000);
        // this.camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 10000);
        this.camera.position.z = 1000; // 1000
        this.camera.position.x = 200;
        this.camera.position.y = 0;
        // this.camera.position.set(600, 600, 1000);
        const light = new THREE.DirectionalLight( 0xffffff ); // ( 0xffffff );
        // const light = new THREE.DirectionalLight( 0xffff00 );
        light.position.set( 0, 1, 1 ).normalize();
        this.scene.add(light);

        const ambient = new THREE.AmbientLight ( 0x555555 );
        this.scene.add(ambient);

        this.createRubixMaterial();

        const geometry = new THREE.BoxGeometry(100, 100, 100);
        const meshFaceMaterial = new THREE.MultiMaterial( this.materials );
        this.mesh1 = new THREE.Mesh(geometry, meshFaceMaterial);
        this.mesh2 = new THREE.Mesh(geometry, meshFaceMaterial);
        this.scene.add(this.mesh1);
        this.scene.add(this.mesh2);

        this.dice_init();

    }

    createRubixMaterial() {

        // 1 (0, Math.PI * 270 / 180) // 4.71
        const material1 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-1.jpg') } );
        // 2 (0, Math.PI * 90 / 180) // 1.57
        const material2 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-2.jpg') } );
        // 3 (Math.PI * 90 / 180, _) 1.57
        const material3 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-3.jpg') } );
        // 4 (Math.PI * 270 / 180 )4.71
        const material4 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-4.jpg') } );
        // 5 (0, 0)  0 or 6.28
        const material5 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-5.jpg') } );
        // 6 (Math.PI * 180 / 180, ) 3.14
        const material6 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-6.jpg') } );

      this.materials = [material1, material2, material3, material4, material5, material6];

    }

    ngAfterViewInit() {
        this.renderer.setSize(450, 220); // 450, 220 600, 400
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.margin = 'auto';
        this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
        // this.renderer.setClearColor( 0x000000, 0);

        this.mesh1.position.set(0, 0, 0); // 좌우 넓이 조절
        this.mesh2.position.set(300, 0, 0); // 좌우 넓이 조절

        // 시작 위치를 랜덤하게 시작한다.
        // this.mesh1.rotation.x = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        // this.mesh1.rotation.y = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        // this.mesh2.rotation.x = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        // this.mesh2.rotation.y = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        // this.animate(this.mesh1, 0);
        // this.animate(this.mesh2, 1);
    }

    private diceAnim (dice1, dice2) {
        console.log( 'diceAnim' );
        console.log(dice1);
        console.log(dice2);
        this.dice_init();
        this.animate(this.mesh1, 0);
        this.animate(this.mesh2, 1);
        this.result_dice = [dice1, dice2];
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

        this.mesh1.rotation.x = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        this.mesh1.rotation.y = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        this.mesh2.rotation.x = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        this.mesh2.rotation.y = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
    }


    animate(mesh, num) {
        console.log('animate start');
        this.diceStartanimation[num] = requestAnimationFrame(() => this.animate(mesh, num));
        mesh.rotation.x += this.speed * 3;
        mesh.rotation.y += this.speed * 2;
        // console.log(mesh.position.y + '/' + this.height[num]);
        // const height = this.height[num]; // - ( (mesh.position.y / this.height[num]));

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


    // user controller part for test
    public startAnim() {
        this.result_dice = [2, 1];
        this.diceAnim(2, 1);
    }

    public setValue() {
        this.mesh2.rotation.x = this.setXvalue;
        this.renderer.render(this.scene, this.camera);
    }
}
