import React from 'react';


function Header(){
    return(
        <div className="
            flex
            justify-between
            items-center
            w-full
            bg-white
            py-2
        ">
            <div className="
                flex
                items-center
                space-x-6
            ">
                <div><a href="/"><img src="assets/logo.png" alt="로고" className="w-20 h-20 min-h-1 min-w-1" /></a></div>
                <div><a href="/asset">자산 조회</a></div>   {/*주소 나중에 변경*/}
                <div><a href="/inv">투자 상품</a></div>     {/*주소 나중에 변경*/}
                <div><a href="/token">토큰 거래</a></div>   {/*주소 나중에 변경*/}
            </div>
            <div className="
                flex
                items-center
                space-x-4
            ">
                <div>
                    <button className="bg-red-500 px-5 py-3 rounded-full text-amber-50">
                        투자자
                    </button>
                </div>
                <div>
                    <img src="assets/bull.png" alt="투자자" className="w-16 h-16" />
                </div>
            </div>
        </div>
    );
}

export default Header;