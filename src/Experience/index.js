import React, { useEffect } from 'react';
import { Canvas } from 'react-three-fiber';
import { withLauncher } from '../Component';
import { withContext } from './ContextProvider';
import FullWindowCanvas from './FullWindowCanvas';
import useContext from './hooks/useContext';
import XR3F from './XR3F';

const Component = ({ XR8 }) => {
    const {
        updateCtx,
    } = useContext();

    useEffect(() => {
        if (XR8) {
            updateCtx({ XR8 });
        }
    }, [XR8, updateCtx]);


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
            <XR3F name={'xr-three'} updateCtx={updateCtx} />
            <FullWindowCanvas />
        </Canvas>
    )
}

export default withContext(withLauncher(Component))