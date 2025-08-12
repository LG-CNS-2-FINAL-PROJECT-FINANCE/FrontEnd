import { useState } from "react";
import AssetHome from "./AssetHome";
import MyAsset from "./MyAsset";

function Asset() {
  const [showAssetHome, setShowAssetHome] = useState(true);

  const toggleComponent = () => {
    setShowAssetHome((prev) => !prev);
  };

  return (
    <div>
      <button
        onClick={toggleComponent}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        TOGGLE
      </button>
      {showAssetHome ? <AssetHome /> : <MyAsset />}
    </div>
  );
}

export default Asset;
