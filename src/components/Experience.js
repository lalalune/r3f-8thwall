import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import useContext from '../hooks/useContext';
import { withLauncher } from './App';
import { withContext } from './ContextProvider';
import FullWindowCanvas from './FullWindowCanvas';

const Component = ({ XR8 }) => {
    const {
        updateCtx,
    } = useContext();

    useEffect(() => {
        if (XR8) {
            updateCtx({ XR8 });
        }
    }, [XR8, updateCtx]);

    const { scene, gl, camera } = useThree();

    const [tapTarget, setTapTarget] = useState(null);
    const $surface = useRef();
    const $box = useRef();

    const canvas = gl.domElement
    canvas.id = "xr-three"

    useFrame(({ gl, scene, camera }) => {

        gl.clearDepth();
        gl.render(scene, camera);

    }, 1)

    useEffect(() => {
        XR8.addCameraPipelineModule({
            name: 'xrthree',
            onStart,
            onUpdate,
            //onRender,
            onCanvasSizeChange,
            xrScene: xrScene
        });
    });

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
            <group>
                <mesh onPointerDown={(e) => setTapTarget(e.intersections[0].point)} receiveShadow position={[0, 0, 0]} ref={$surface} rotation-x={-Math.PI / 2}>
                    <planeGeometry
                        attach='geometry'
                        args={[100, 100, 1, 1]}
                    />
                    <shadowMaterial
                        opacity={0.3}
                    />
                </mesh>
                <mesh castShadow position={tapTarget} visible={!!tapTarget} ref={$box} userData={{ hello: 'yop' }} >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="hotpink" />
                </mesh>
            </group>
            )

            <FullWindowCanvas />
        </Canvas>
    )
}

export default withContext(withLauncher(Component))