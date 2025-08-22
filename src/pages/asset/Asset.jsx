import { use, useState } from "react";
import AssetHome from "./AssetHome";
import MyAsset from "./MyAsset";
import useUser from "../../lib/useUser";

function Asset() {
  const { user } = useUser();
  const [showAssetHome, setShowAssetHome] = useState();

  const toggleComponent = () => {
    setShowAssetHome((prev) => !prev);
  };

  return <div>{showAssetHome ? <AssetHome /> : <MyAsset />}</div>;
}

export default Asset;
