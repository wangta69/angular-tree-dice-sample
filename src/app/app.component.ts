import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit  {
    @ViewChild('rendererContainer') rendererContainer: ElementRef;

    renderer = new THREE.WebGLRenderer();
    scene = null;
    camera = null;
    mesh1 = null;
    mesh2 = null;
    materials = null;
    // positon = null;
    scale: number ; // 주사위 스케일
    scale_min_limit: number; // 주사위 스케일 최소
    scale_max_limit: number; // 주사위 스케일 최대
    scale_direction: string; // 주사위 방향
    speed: number; // 0.01
    speed_scale: number; // 0.02
    bound_time: [number, number]; // 주사위 바운드 숫자 : 2번 바운드 후 바닥에 않을 때 실제 좌표입력

    result_dice: [number, number];
    random_start_angle = [0, 1, 2, 3];
    //random_start_angle = [0, Math.PI * 90, Math.PI * 180, Math.PI * 270];
    constructor() {

    }

    ngOnInit() {

    this.scene = new THREE.Scene();

    // 위치
    // this.positon = new THREE.Vector3( 0, 1, 0 );
    // PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    // https://www.jonathan-petitcolas.com/2013/04/02/create-rotating-cube-in-webgl-with-threejs.html
    this.camera = new THREE.PerspectiveCamera(25, 450 / 220, 1, 10000);
    // this.camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 10000);
     this.camera.position.z = 1000; // 1000
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

        // 1 (0, Math.PI * 270 / 180)
        const material1 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-1.jpg') } );
        // 2 (0, Math.PI * 90 / 180)
        const material2 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-2.jpg') } );
        // 3 (Math.PI * 90 / 180, _)
        const material3 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-3.jpg') } );
        // 4 (Math.PI * 270 / 180)
        const material4 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-4.jpg') } );
        // 5 (0, 0)
        const material5 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-5.jpg') } );
        // 6 (Math.PI * 180 / 180, )
        const material6 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('./assets/dice-white-6.jpg') } );

      this.materials = [material1, material2, material3, material4, material5, material6];

    }

    ngAfterViewInit() {
        this.renderer.setSize(450, 220);// 450, 220 600, 400
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.margin = 'auto';
        this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

        this.mesh1.position.set(-200, -150, 1); // 좌우 넓이 조절
        this.mesh2.position.set(200, -150, 1); // 좌우 넓이 조절

        // 시작 위치를 랜덤하게 시작한다.
        this.mesh1.rotation.x = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        this.mesh1.rotation.y = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        this.mesh2.rotation.x = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        this.mesh2.rotation.y = this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)];
        console.log(this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)]);
        console.log(this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)]);
        console.log(this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)]);
        console.log(this.random_start_angle[Math.floor(Math.random() * this.random_start_angle.length)]);
        this.animate(this.mesh1, 0);
        this.animate(this.mesh2, 1);
    }


    dice_init() {
        this.scale_min_limit = 1; // 주사위 스케일 최소
        this.scale_max_limit = 2; // 주사위 스케일 최대
        this.scale_direction = 'plus'; // 주사위 방향
        this.speed = 0.05; // 0.01
        this.speed_scale = 0.005; // 0.02
        this.bound_time = [0, 0]; // 주사위 바운드 숫자 : 2번 바운드 후 바닥에 않을 때 실제 좌표입력

        this.scale = this.scale_min_limit;

        this.result_dice = [5, 2];
    }

    animate(mesh, num) {
        console.log(num + ':' + mesh.rotation.x);
      const diceStartanimation = window.requestAnimationFrame(() => this.animate(mesh, num));
      // console.log(Math.PI * 90 / 180);
          mesh.rotation.x += this.speed * 2;
          mesh.rotation.y += this.speed;
         // this.mesh.rotation.z += this.speed * 3;
         // this.mesh.rotation.z += 0.01;
         console.log();
         mesh.position.setY((this.scale - this.scale_min_limit) * 300 - 150 ); // 높이 값을 변경한다.
        // mesh.position.set(1, (this.scale - this.scale_min_limit) * 300, 1); // 높이 값을 변경한다.
         // this.mesh.position.copy(this.location); // mover의 mesh객체에 위치 적용

        if (this.scale_direction === 'plus') {
            this.scale  += this.speed_scale;
            if (this.scale >= this.scale_max_limit ) {
                this.scale_direction = 'minus';
            }
        } else {
            this.scale  -= this.speed_scale;
            if (this.scale <= this.scale_min_limit ) {
                if (this.bound_time[num] === 2) {
                    cancelAnimationFrame(diceStartanimation);
                    this.animate_result(mesh, num);
                    console.log('animate_result start..');
                }
                this.scale_max_limit =  this.scale_max_limit / 1.5;
                this.scale_direction = 'plus';
                this.bound_time[num] ++;

                // console.log(bound_time)
            }
        }
        mesh.scale.set(this.scale, this.scale, this.scale);
        this.renderer.render(this.scene, this.camera);
    }

    animate_result(mesh, num) {
        let stop_x = false;
        let stop_y = false;

        const result_dice_degree = [
                [0, 0],
                [0, Math.PI * 270 / 180], // 0 : 0, 90: 1.57, 180: 3. 14, 270: 4.71, 360: 6.28
                [0, Math.PI * 90 / 180],
                [Math.PI * 90 / 180, 0],
                [Math.PI * 270 / 180, 0],
                [0, 0],
                [Math.PI, 0]
            ];

        //    console.log(mesh.rotation.x);
            // [1, 3]
        const diceEndanimation = window.requestAnimationFrame(() => this.animate_result(mesh, num));
            // Pi는 3.14이므로
            // console.log('num : ' + num);
            const result_dice = this.result_dice[num];
             // console.log('result_dice : ' + result_dice);
            if ( Math.abs(mesh.rotation.x % Math.PI - Math.abs(result_dice_degree[result_dice][0] % Math.PI) ) > 0.01 ) {
              // console.log('x:' + Math.abs(mesh.rotation.x % Math.PI - Math.PI ));
                mesh.rotation.x += (this.speed - 0.01); // 돌아가는 속도를 줄인다.
            } else {
                mesh.rotation.x = result_dice_degree[result_dice][0];
                stop_x = true;
            }

            if (Math.abs(mesh.rotation.y % Math.PI - Math.abs(result_dice_degree[result_dice][1] % Math.PI) ) > 0.01 ) {
                mesh.rotation.y += (this.speed - 0.01); // 돌아가는 속도를 줄인다.
            } else {
                mesh.rotation.y = result_dice_degree[result_dice][1];
                stop_y = true;
            }

            if (stop_x && stop_y) {
                cancelAnimationFrame(diceEndanimation);
            }
          mesh.scale.set(this.scale, this.scale, this.scale);
          this.renderer.render(this.scene, this.camera);
    }
}
