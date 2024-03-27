import * as THREE from 'three'
import Experience from '../Experience'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        /**
         * normalBias属性是用于修正阴影贴图中的表面法线偏差的属性。法线偏差用于解决阴影贴图中的自阴影（Shadow acne）和彩虹阴影（Peter panning）等问题。
        通过调整normalBias属性，你可以改变表面法线的偏移量，从而影响阴影的渲染效果。较小的偏移量可以减少自阴影和彩虹阴影，但可能会导致部分对象过早脱离阴影。较大的偏移量则可以更彻底地解决自阴影和彩虹阴影问题，但可能会导致阴影与实际物体之间存在间隙。
        通常情况下，normalBias的值应该是一个很小的正数，以消除阴影渲染中的问题。然而，具体的值需要根据你的场景和需求进行调整和优化。
        */
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)

        //Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001)
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        /**
         * texture.encoding属性用于指定纹理的编码方式，即纹理的颜色空间。这个属性主要用于指定纹理在内存中的存储格式以及在渲染时的解码方式，以确保纹理能够正确地显示并受到光照的影响。
        常见的纹理编码方式包括：
        THREE.LinearEncoding: 线性编码，纹理颜色值存储为线性空间中的值。适用于大多数情况，例如未经过颜色转换的图像。
        THREE.sRGBEncoding: sRGB编码，纹理颜色值存储为sRGB空间中的值。适用于经过gamma校正的图像，例如从屏幕截图中获取的图像。
        THREE.RGBEEncoding: RGBE编码，将纹理颜色值存储为RGBE格式，用于高动态范围（HDR）纹理。
        THREE.RGBM16Encoding: RGBM16编码，用于存储具有高动态范围的纹理，适用于较低的内存使用情况。
        THREE.RGBA16FEncoding: RGBA16F编码，使用16位浮点数存储纹理颜色值。
        THREE.RGBA32FEncoding: RGBA32F编码，使用32位浮点数存储纹理颜色值。
        */
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }

        this.environmentMap.updateMaterials()

        //Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}