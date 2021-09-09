import React, { useRef, useState, Fragment } from "react";
import { useFrame, useThree } from "react-three-fiber";
import Box from "./Box";

export default function Portal() {
    const { scene, gl, camera } = useThree();
    // const schema = {
    //     width: { default: 4 },
    //     height: { default: 6 },
    //     depth: { default: 1 },
    // };
    const $stage = useRef();
    const $contents = useRef();
    const $walls = useRef();
    //   const $portalWall = useRef();

    const [isInPortalSpace, setIsInPortalSpace] = useState(false);
    const [wasOutside, setWasOutside] = useState(true);

    useFrame(() => {
        const { position } = camera;

        const isOutside = position.z > this.data.depth / 2;
        const withinPortalBounds =
            position.y < this.data.height &&
            Math.abs(position.x) < this.data.width / 2;

        if (wasOutside !== isOutside && withinPortalBounds) {
            setIsInPortalSpace(!isOutside);
        }

        $contents.object3D.visible = isInPortalSpace || isOutside;
        $walls.object3D.visible = !isInPortalSpace && isOutside;
        // this.portalWall.object3D.visible = isInPortalSpace && !isOutside;

        setWasOutside(isOutside);
    });

    function setTapTarget(point) {
        $stage.setPosition(point);
    }

    //   <group ref={$portalWall}>
    //   <Plane
    //     scale="4 6 1"
    //     rotation="180 0 0"
    //     position="0 3 0.5"
    //   ></Plane>
    // </group>

    return (
        <Fragment>
            <mesh
                onPointerDown={(e) => setTapTarget(e.intersections[0].point)}
                receiveShadow
                position={[0, 0, 0]}
                ref={$stage}
                rotation-x={-Math.PI / 2}
            >

                <Box scale="1 6 1" position="-2.5 3 0" color="#8083A2" />
                <Box scale="1 6 1" position="2.5 3 0" color="#8083A2" />
                <Box scale="6 1 1" position="0 6.5 0" color="#8083A2" />

                <group ref={$walls}>
                    <Box scale="6 100 1" position="0 57 0" />
                    <Box scale="94 100 1" position="-50 50 0" />
                    <Box scale="94 100 1" position="50 50 0" />
                    <Box scale="200 100 1" position="0 50 200" />
                    <Box scale="200 1 201" position="0 100 100" />
                    <Box scale="200 1 199" position="0 -0.5 100" />
                    <Box scale="1 100 200" position="-100 50 100" />
                    <Box scale="1 100 200" position="100 50 100" />
                </group>

                <group
                    light="
            type: directional;
            intensity: 0.8;
            castShadow: true;
            shadowMapHeight:2048;
            shadowMapWidth:2048;
            shadowCameraTop: 10;
            target: #ball;"
                    position="1 4.3 2.5"
                    xrextras-attach="target: ball; offset: 0 15 0;"
                    shadow
                ></group>
                <group light="type: ambient; intensity: 0.65;"></group>

                <group ref={$contents}>
                    <Box scale="5 1 10" position="0 -0.5 -4.5" color="#8083A2" shadow />
                </group>
            </mesh>
            )
        </Fragment>
    );
}
// <group
// id="ball"
// scale="5 5 5"
// position="0 1.5 -7"
// gltf-model="#ballModel"
// cubemap-static
// bob
// shadow
// ></group>