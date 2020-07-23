import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

export const CreateTransformControls = (mesh, camera, renderer, orbitControls, scene) => {

    const transformControls = new TransformControls(camera, renderer.domElement)
    transformControls.addEventListener('dragging-changed', (event) => { orbitControls.enabled = !event.value })
    transformControls.attach(mesh)
    scene.add(transformControls)
    //transformControls.setMode('scale')
}

