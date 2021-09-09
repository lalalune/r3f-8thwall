import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { Object3D } from 'three';
import useContext from '../hooks/useContext';
import { withLauncher } from './App';
import { withContext } from './ContextProvider';
import FullWindowCanvas from './FullWindowCanvas';
import Portal from './Portal';

const Application = ({ XR8 }) => {
    const {
        updateCtx,
    } = useContext();
    const { scene, gl, camera } = useThree();
    useEffect(() => {
        // XR8.addCameraPipelineModule({
        //     name: 'xrthree',
        //     onStart,
        //     onUpdate,
        //     //onRender,
        //     onCanvasSizeChange,
        //     xrScene: xrScene
        // });
    });


    useEffect(() => {
        if (XR8) {
            updateCtx({ XR8 });
        }
    }, [XR8, updateCtx]);



    useFrame(({ gl, scene, camera }) => {

        gl.clearDepth();
        gl.render(scene, camera);

    }, 1)

    const onCanvasSizeChange = ({ canvasWidth, canvasHeight }) => {
        gl.setSize(canvasWidth, canvasHeight);
        camera.aspect = canvasWidth / canvasHeight
        camera.updateProjectionMatrix()
    }

    const onStart = ({ canvasWidth, canvasHeight }) => {
        gl.autoClear = false;
        gl.setSize(canvasWidth, canvasHeight);
        gl.antialias = true;

        updateCtx({
            scene,
            camera,
            renderer: gl,
        })

        XR8.XrController.updateCameraProjectionMatrix({
            origin: camera.position,
            facing: camera.quaternion,
        });
    }

    const onUpdate = ({ processCpuResult }) => {
        camera.updateProjectionMatrix()

        let data = processCpuResult.reality
        if (!(data && data.intrinsics)) return

        let { intrinsics, position, rotation } = data
        let { elements } = camera.projectionMatrix

        for (let i = 0; i < 16; i++) {
            elements[i] = intrinsics[i]
        }

        camera.projectionMatrixInverse.getInverse(camera.projectionMatrix);
        camera.setRotationFromQuaternion(rotation)
        camera.position.copy(position)
    }


    const xrScene = () => {
        return { scene, camera, renderer: gl };
    }

    return (
        <Canvas concurrent={true} style={{ width: '100%', height: '100%', position: 'absolute', left: '0px', top: '0px', zIndex: 100 }} shadowMap updateDefaultCamera={false} camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <spotLight
                intensity={0.6}
                position={[20, 10, 10]}
                angle={0.2}
                penumbra={1}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                castShadow
            />
            <Portal />

            <FullWindowCanvas />
        </Canvas>
    )
}

export default withContext(withLauncher(Application))