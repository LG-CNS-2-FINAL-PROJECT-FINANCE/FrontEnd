import React from 'react';

//이미지 import
import { FaInstagram } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FiFigma } from "react-icons/fi";

function Footer(){
    return(
        <div className="
            bg-gray-100      /* background-color: #f0f0f0; */
            w-full           /* 부모(body)의 콘텐츠 영역 내에서 100% 너비 */
            flex             /* display: flex; */
            justify-center   /* justify-content: center; */
            items-center     /* align-items: center; */
            p-4
        ">
            <div className="flex w-full">
                <div className="flex-1 px-4">
                    <a href="https://www.figma.com/design/ruajNmq7QWqaStt0kJxMv5/LG-CNS-2%EA%B8%B0-%EA%B8%88%EC%9C%B5-3%EC%A1%B0?node-id=1173-5&p=f&t=r5JeQ7dzLK8q2nYl-0"><FiFigma className="h-7 w-7"/></a>
                    <div className="flex mt-2 text-sm">
                        <div className="px-1">
                            <a href="https://x.com/login?lang=ko"><FaXTwitter className="h-5 w-5"/></a>
                        </div>
                        <div className="px-1">
                            <a href="https://www.instagram.com/"><FaInstagram className="h-5 w-5"/></a>
                        </div>
                        <div className="px-1">
                            <a href="https://www.youtube.com/"><FiYoutube className="h-5 w-5"/></a>
                        </div>
                    </div>
                </div>
                <div className="flex-1 px-4">
                    <div>Frontend
                        <div className="mt-2 text-sm text-gray-700">
                            <div>Design</div>
                            <div>Prototyping</div>
                            <div>Development features</div>
                            <div>Design system</div>
                            <div>Collaboration feature</div>
                            <div>Design process</div>
                            <div>FigJam</div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 px-4">
                    <div>Backend
                        <div className="mt-1 text-sm text-gray-700">
                            <div>Blog</div>
                            <div>Blog</div>
                            <div>Blog</div>
                            <div>Blog</div>
                            <div>Blog</div>
                            <div>Blog</div>
                            <div>Blog</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;