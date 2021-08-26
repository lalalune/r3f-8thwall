import React, { Fragment, useRef } from "react";
import PortalModal from "./PortalModal";
import use8thWall from "../hooks/use8thWall";

export const withLauncher = (Experience) => {
  const WrappedExperience = ({ appKey, xr8Config, updateCtx, ...props }) => {
    const cameraFeed = useRef(null);

    const XR8 = use8thWall(appKey, cameraFeed.current);

    return (
      <Fragment>
        <PortalModal rootElement={document.body}>
          <canvas ref={cameraFeed} />
        </PortalModal>
        {XR8 && <Experience XR8={XR8} xr8Config={xr8Config} {...props} />}
      </Fragment>
    )
  }
  return (props) => <WrappedExperience {...props} />
};
