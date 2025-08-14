import React from "react";

function Button({children, size, onClick}){
    return(
        <div>
            <button className={`p-2 bg-red-500 text-${size} rounded-xl text-amber-50 mt-1 h-14 w-36`}>
                {children}
            </button>
        </div>
    )
}

export default Button;
