
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import "./style.css"
const STLCanvas = () => {
    const mount = useRef(null)
    const scene = useRef()
    const camera = useRef()

    useEffect(() => {
        let width = mount.current.clientWidth
        let height = mount.current.clientHeight
        let renderer, control

        const init = () => {
            scene.current = new THREE.Scene()
            camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
            renderer = new THREE.WebGLRenderer({ antialias: true })
            control = new OrbitControls(camera.current, renderer.domElement)
            renderer.setSize(width, height)
            renderer.shadowMap.enabled = true
            scene.current.background = new THREE.Color(0x72645b)
            camera.current.lookAt(scene.current.position)
            camera.current.position.z = 50

            createPlane()

            mount.current.appendChild(renderer.domElement)
            window.addEventListener('resize', handleResize, false)
        }

        const createPlane = () => {
            var plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(40, 40),
                new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
            )
            plane.rotation.x = - Math.PI / 2
            plane.position.y = - 0.5
            scene.current.add(plane)
        }

        const createGridFloor = () => {
            const size = 40
            const divisions = 80
            const gridHelper = new THREE.GridHelper(size, divisions)
            scene.current.add(gridHelper)
        }

        const addWireFrame = (mesh) => {
            const geo = new THREE.WireframeGeometry(mesh.geometry) // or WireframeGeometry( geometry )

            const mat = new THREE.MeshPhongMaterial({ color: 0xff00ff, linewidth: 2 })

            const wireframe = new THREE.LineSegments(geo, mat)

            wireframe.rotation.x = - Math.PI / 2
            wireframe.scale.set(0.5, 0.5, 0.5)
            scene.current.add(wireframe)
        }

        const addLight = () => {
            const light = new THREE.DirectionalLight(0xffffff, 1)
            light.position.set(1, 1, 1).normalize()
            scene.current.add(light)
        }

        const handleResize = () => {
            width = mount.current.clientWidth
            height = mount.current.clientHeight
            renderer.setSize(width, height)
            camera.current.aspect = width / height
            camera.current.updateProjectionMatrix()
        }

        const animate = () => {
            requestAnimationFrame(animate)
            control.update()
            control.enableZoom = true
            render()
        }

        const render = () => {
            renderer.render(scene.current, camera.current)
        }

        init()
        addLight()
        createGridFloor()
        animate()

    }, [])

    const loadSTL = (event) => {
        event.preventDefault()
        const loader = new STLLoader()
        let reader = new FileReader()
        reader.readAsDataURL(event.target.file.files[0])
        reader.onload = (event) => {
            loader.load(event.target.result, geometry => {
                const material = new THREE.MeshPhongMaterial({ color: 0xff00ff })
                const mesh = new THREE.Mesh(geometry, material)
                
                // Rotate to flat plane
                mesh.rotation.x = - Math.PI / 2
                mesh.scale.set(0.5, 0.5, 0.5)
                mesh.receiveShadow = true
                mesh.castShadow = true
                //mesh.rotateZ(Math.PI / 2)

                mesh.geometry.computeBoundingBox()
                mesh.geometry.center()
                
                // Adjusting model such that it is on the plane
                mesh.position.y += -mesh.geometry.boundingBox.min.z / 2

                scene.current.add(mesh)
            })
        }
    }

    return (
        <>
            <div className="stl-wrapper" ref={mount}>

            </div>
            <form onSubmit={loadSTL}>
                <input type="file" name="file"></input>
                <button type="submit">submit</button>
            </form>

        </>

    )
}

export default STLCanvas
