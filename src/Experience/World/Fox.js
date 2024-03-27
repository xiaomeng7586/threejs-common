import * as THREE from 'three'
import Experience from "../Experience.js"

export default class Fox
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        //Setup
        this.resource = this.resources.items.foxModel

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        /**
         * AnimationMixer是用于管理动画的核心类之一。它负责控制模型中的动画播放和混合。
        下面是一些AnimationMixer的常用方法：
        clipAction(clip: AnimationClip, root: Object3D): AnimationAction: 为给定的动画片段创建一个动画操作，并将其绑定到指定的根对象。
        addAction(action: AnimationAction, root: Object3D): void: 将一个动画操作添加到混合器中，并将其绑定到指定的根对象。
        removeAction(action: AnimationAction): void: 从混合器中移除指定的动画操作。
        getActionForClip(clip: AnimationClip): AnimationAction | null: 根据给定的动画片段获取对应的动画操作。
        update(deltaTime: number): void: 更新混合器中所有动画操作的状态，通常在动画循环中调用。
        */
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        this.animation.actions = {}

        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        this.animation.play = (name) => 
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') },
            }

            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}