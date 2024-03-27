import * as THREE from 'three'
import Experience from "./Experience.js"

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.camera = this.experience.camera
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer(
            {
                canvas: this.canvas,
                antialias: true
            }
        )
        /**
         * physicallyCorrectLights 启用物理正确光照
        */
        this.instance.physicallyCorrectLights = true
        /**outputEncoding 指定渲染器输出编码方式的选项之一。它控制了在渲染过程中如何处理颜色值的范围和格式。
         *  THREE.LinearEncoding: 默认值。颜色值按照线性方式处理，适用于大多数情况。
            THREE.sRGBEncoding: 颜色值按照sRGB颜色空间进行编码，用于更好地匹配显示器的响应曲线，以获得更准确的颜色呈现。
            THREE.RGBEEncoding: 使用RGBE编码来存储颜色值，通常用于HDR（高动态范围）渲染。
            THREE.RGBM7Encoding和THREE.RGBM16Encoding: 使用RGBM编码来存储颜色值，通常用于HDR渲染。
            THREE.RGBDEncoding: 使用RGBD编码来存储颜色值，也通常用于HDR渲染。
        */
        this.instance.outputEncoding = THREE.sRGBEncoding
        /**toneMapping 控制渲染时的色调映射算法，以模拟不同曝光条件下的颜色响应。这对于实现高动态范围（HDR）渲染非常重要。
         *  THREE.NoToneMapping: 默认值，不进行色调映射，直接输出线性颜色。
            THREE.LinearToneMapping: 简单的线性色调映射，适用于标准的非HDR渲染。
            THREE.ReinhardToneMapping: 使用Reinhard算法进行色调映射，增强对比度和色彩饱和度，适用于HDR渲染。
            THREE.Uncharted2ToneMapping: 使用Uncharted 2算法进行色调映射，产生更逼真的图像，尤其在强烈光照下效果显著，适用于HDR渲染。
            THREE.CineonToneMapping: 模拟了传统电影的色调映射算法，产生类似胶片的效果。
        */
        this.instance.toneMapping = THREE.CineonToneMapping
        /**
         * toneMappingExposure 用于调整色调映射后的输出亮度，以影响场景最终的明暗效果。该属性通常与toneMapping结合使用，用于调整HDR渲染结果的整体明暗对比度。
         * toneMappingExposure的值是一个浮点数，表示相机的曝光值（EV），用于控制图像的亮度。较大的值会使整个场景变得更亮，而较小的值会使场景变暗。
        */
        this.instance.toneMappingExposure = 1.75
        /**
         * shadowMap属性用于控制阴影的渲染方式和质量。
         * 以下是一些常见的shadowMap属性及其作用：
            type: 指定阴影映射的类型，可以是BasicShadowMap、PCFShadowMap、PCFSoftShadowMap或VSMShadowMap。默认值为PCFShadowMap。
            enabled: 指定是否启用阴影映射。设置为true时启用阴影，设置为false时禁用阴影。默认值为false。
            autoUpdate: 指定阴影贴图是否自动更新。如果设置为true，则每帧都会自动更新阴影贴图。默认值为true。
            needsUpdate: 标志阴影贴图是否需要更新。当设置为true时，会强制更新阴影贴图。
            shadowMapSize: 指定阴影贴图的大小。可以设置为new THREE.Vector2(width, height)，其中width和height为阴影贴图的宽度和高度。
            shadowBias: 指定阴影偏移量。用于调整阴影的精度，避免阴影失真。通常设置为一个很小的值。较大的偏移量会使阴影产生较大的偏移，但可能会导致阴影失真。
            shadowCameraNear: 指定阴影相机的近裁剪面。默认值为0.5。
            shadowCameraFar: 指定阴影相机的远裁剪面。默认值为500。
            shadowCameraFov: 指定阴影相机的视场角。默认值为50。
            shadowCameraTop, shadowCameraBottom, shadowCameraLeft, shadowCameraRight: 指定阴影相机的上、下、左、右边界。默认值为10。
        */
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFShadowMap
        // this.instance.setClearAlpha
        this.instance.setClearColor('#211d20', 1)
        this.instance.setSize(this.sizes.width, this.sizes.height)
        /**
         * setPixelRatio 用于设置渲染器的设备像素比。设备像素比是指渲染器将渲染的每个CSS像素所使用的屏幕像素数目。
        */
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}