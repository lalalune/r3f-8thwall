import React, { useRef } from "react";
import PortalModal from "./elements/PortalModal";
import use8thWall from "./hooks/use8thWall";

export const withLauncher = (Experience) => {
  const WrappedExperience = ({ appKey, xr8Config, updateCtx, ...props }) => {
    const cameraFeed = useRef(null);

    const XR8 = use8thWall(appKey, cameraFeed.current);

    return (
      <>
        <PortalModal rootElement={document.body}>
          <canvas ref={cameraFeed} />
        </PortalModal>
        {XR8 && <Experience XR8={XR8} xr8Config={xr8Config} {...props} />}
      </>
    );
  };
  return (props) => <WrappedExperience {...props} />;
};
