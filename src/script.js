import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// floor
const alphaMapTextureLoader = textureLoader.load('./floor/alpha.jpg');
const ARMTextureLoader = textureLoader.load('./floor/textures/coast_sand_rocks_02_arm_1k.jpg')
const colorTextureLoader = textureLoader.load('./floor/textures/coast_sand_rocks_02_diff_1k.jpg')
const normTextureLoader = textureLoader.load('./floor/textures/coast_sand_rocks_02_nor_1k.jpg')
const dispTextureLoader = textureLoader.load('./floor/textures/coast_sand_rocks_02_disp_1k.jpg')

colorTextureLoader.colorSpace = THREE.SRGBColorSpace;
colorTextureLoader.repeat.set(8,8);
ARMTextureLoader.repeat.set(8,8);
normTextureLoader.repeat.set(8,8);
dispTextureLoader.repeat.set(8,8);

colorTextureLoader.wrapS = THREE.RepeatWrapping;
colorTextureLoader.wrapT = THREE.RepeatWrapping

ARMTextureLoader.wrapT = THREE.RepeatWrapping
ARMTextureLoader.wrapS = THREE.RepeatWrapping;

normTextureLoader.wrapT = THREE.RepeatWrapping
normTextureLoader.wrapS = THREE.RepeatWrapping;

dispTextureLoader.wrapS = THREE.RepeatWrapping;
dispTextureLoader.wrapT = THREE.RepeatWrapping


// walls
const wallColorTexture = textureLoader.load('./walls/textures/castle_brick_02_red_diff_1k.jpg');
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
const wallARMTexture = textureLoader.load('./walls/textures/castle_brick_02_red_arm_1k.jpg');
const wallnormalTexture = textureLoader.load('./walls/textures/castle_brick_02_red_nor_1k.jpg');

// graves
const graveColorTexture = textureLoader.load('./graves/seaside_rock_1k/textures/seaside_rock_diff_1k.jpg');
graveColorTexture.colorSpace = THREE.SRGBColorSpace;
const graveARMTexture = textureLoader.load('./graves/seaside_rock_1k/textures/seaside_rock_arm_1k.jpg');
const gravenormalTexture = textureLoader.load('./graves/seaside_rock_1k/textures/seaside_rock_nor_1k.jpg');
const graveDispTexture = textureLoader.load("./graves/seaside_rock_1k/textures/seaside_rock_dis_1k.jpg")

// roof
const roofColorTexture = textureLoader.load('./roof/roof_07_1k/textures/roof_07_diff_1k.jpg');
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
const roofARMTexture = textureLoader.load('./roof/roof_07_1k/textures/roof_07_arm_1k.jpg');
const roofnormalTexture = textureLoader.load('./roof/roof_07_1k/textures/roof_07_nor_1k.jpg');
const roofDispTexture = textureLoader.load('./roof/roof_07_1k/textures/roof_07_disp_1k.jpg')

roofColorTexture.repeat.set(3,1);
roofColorTexture.wrapS = THREE.RepeatWrapping;

// door
const doorColorTexture = textureLoader.load('./door/color.jpg');
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorAOTexture = textureLoader.load('./door/ambientOcclusion.jpg');
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg');
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg');
const doorNormalTexture = textureLoader.load('./door/normal.jpg');
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg');
const doorDispTexture = textureLoader.load('./door/height.jpg');



/**
 * House
 */
// Temporary sphere
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial({ roughness: 0.7 })
// )
// scene.add(sphere)

// 

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20,100,100),
    new THREE.MeshStandardMaterial({alphaMap : alphaMapTextureLoader, transparent: true,
        map: colorTextureLoader,
        aoMap : ARMTextureLoader,
        metalnessMap: ARMTextureLoader,
        roughnessMap: ARMTextureLoader,
        displacementMap : dispTextureLoader,
        displacementScale: 0.3,
        displacementBias: -0.2,
        normalMap: normTextureLoader

    })
)
plane.rotation.x = - Math.PI * 0.5;
scene.add(plane);

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallnormalTexture
    })
)
walls.position.y = 2.5 / 2;
house.add(walls);

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.3, 2, 4),
    new THREE.MeshStandardMaterial(
        {
            map: roofColorTexture,
            aoMap: roofARMTexture,
            metalnessMap: roofARMTexture,
            roughnessMap: roofARMTexture,
            normalMap: roofnormalTexture,
        }
    )
)
roof.position.y = 2.5 + (2 / 2);
roof.rotation.y = Math.PI / 4;
house.add(roof)

const graves = new THREE.Group();
scene.add(graves);

const graveBox = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({map: graveColorTexture, aoMap: graveARMTexture, roughnessMap: graveARMTexture, metalnessMap: graveARMTexture, normalMap: gravenormalTexture});

for(let i=0; i<30; i++){
    const grave = new THREE.Mesh(graveBox, graveMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 5
    const x = Math.sin(angle) * radius;
    const y = Math.random() * 0.4;
    const z = Math.cos(angle) * radius;

    grave.rotation.x = Math.PI * 0.05 * (Math.random() - 0.5);
    grave.rotation.z = Math.PI * 0.06 * (Math.random() - 0.5);

    grave.position.set(x, y , z);
    graves.add(grave);

}

const doorShape = new THREE.PlaneGeometry(2.2, 2.2, 100, 100);
const doorMaterial = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    aoMap: doorAOTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    displacementMap: doorDispTexture,
    displacementScale: 0.15,
    displacementBias: -0.04
});

const door = new THREE.Mesh(doorShape, doorMaterial);
door.position.y = 1;
door.position.z = 2 + 0.01
house.add(door)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

const doorLight = new THREE.PointLight(0xff7d47, 5);
doorLight.position.set(0, 2.2, 2.5)
scene.add(doorLight);

// const pointLightHelper = new THREE.PointLightHelper(doorLight, 0.2);
// scene.add(pointLightHelper)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(directionalLightHelper)

const ghost1 = new THREE.PointLight('#ff0088', 6, 10, 2);
const ghost2 = new THREE.PointLight('#8800ff', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Sky
 */
const sky = new Sky();
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1 
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);
sky.scale.set(100, 100, 100)
scene.add(sky);

/**
 * Fog
 */
scene.fog = new THREE.FogExp2('#04343F', 0.1)

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    //ghosts
    const ghostAngle = elapsedTime * 0.4;
    ghost1.position.x = 4 * Math.sin(ghostAngle);
    ghost1.position.z = 4 * Math.cos(ghostAngle);
    ghost1.position.y = Math.sin(ghostAngle) * Math.sin(ghostAngle - 2.34) * Math.sin(ghostAngle - 3.45);

    const ghostAngle2 = - elapsedTime * 0.6;
    ghost2.position.x = 6 * Math.sin(ghostAngle2);
    ghost2.position.z = 6 * Math.cos(ghostAngle2);
    ghost2.position.y =  Math.sin(ghostAngle2) * Math.sin(ghostAngle2 - 2.34) * Math.sin(ghostAngle2 - 3.45);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()