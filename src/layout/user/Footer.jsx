import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FiFigma } from "react-icons/fi";

function Footer() {
    const frontendMembers = [
        { name: "구민", url: "https://github.com/ku0629" },
        { name: "안효준", url: "https://github.com/hyojunahn111" },
        { name: "이준호", url: "https://github.com/Junho0225" },
    ];

    const backendMembers = [
        { name: "김동현", url: "https://github.com/dohy0103" },
        { name: "김민우", url: "https://github.com/rlaalsdn0421" },
        { name: "권순영", url: "https://github.com/kaebalsaebal" },
        { name: "남상원", url: "https://github.com/NamSangwon" },
        { name: "오장현", url: "https://github.com/5ohmydays5" },
        { name: "이민기", url: "https://github.com/DDu-DDu" },
    ];

    return (
        <footer className="bg-gray-100 border-t border-gray-300 px-[10%] py-8">
            <div className="flex flex-col md:flex-row md:justify-between gap-8">
                {/* 왼쪽 - 로고 / SNS / 회사정보 */}
                <div className="md:w-1/2">
                    <a
                        href="https://www.figma.com/design/ruajNmq7QWqaStt0kJxMv5"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block"
                    >
                        <FiFigma className="h-8 w-8 text-gray-700 hover:text-purple-500 transition-colors duration-200" />
                    </a>

                    {/* SNS */}
                    <div className="flex mt-4 space-x-3">
                        {[
                            {
                                icon: <FaXTwitter className="h-5 w-5" />,
                                url: "https://x.com/login?lang=ko",
                                color: "hover:bg-black",
                            },
                            {
                                icon: <FaInstagram className="h-5 w-5" />,
                                url: "https://www.instagram.com/",
                                color: "hover:bg-pink-500",
                            },
                            {
                                icon: <FiYoutube className="h-5 w-5" />,
                                url: "https://www.youtube.com/",
                                color: "hover:bg-red-600",
                            },
                        ].map((sns, idx) => (
                            <a
                                key={idx}
                                href={sns.url}
                                target="_blank"
                                rel="noreferrer"
                                className={`p-2 bg-gray-200 rounded-full text-gray-600 ${sns.color} hover:text-white transition-all duration-200`}
                            >
                                {sns.icon}
                            </a>
                        ))}
                    </div>

                    {/* 회사 정보 */}
                    <div className="text-xs mt-5 text-gray-500 leading-relaxed">
                        <div>Copyright © 2025 Zzogaemall Inc. All rights reserved.</div>
                        <div className="mt-2">
                            고객센터 1588+1588 (평일 09:00~18:00/유료) | 금융사고 전담 1533+1533
                            (24시간 연중무휴/유료)
                            <br />
                            서울특별시 중구 필동로 1길 30, 2층 (평일 09:00~18:00)
                            <br />
                            30, Pildong-ro 1-gil, Jung-gu, Seoul, 04620, Republic of Korea
                            <br />쪼개몰(주)
                        </div>
                    </div>
                </div>

                {/* 오른쪽 - 팀원 */}
                <div className="grid grid-cols-2 gap-10 text-sm text-gray-600 md:w-1/2">
                    {/* Frontend */}
                    <div>
                        <h3 className="text-gray-800 font-semibold uppercase text-xs tracking-wide">
                            Frontend
                        </h3>
                        <ul className="mt-3 space-y-2">
                            {frontendMembers.map((member, idx) => (
                                <li key={idx}>
                                    <a
                                        href={member.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all duration-200"
                                    >
                                        {member.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Backend */}
                    <div>
                        <h3 className="text-gray-800 font-semibold uppercase text-xs tracking-wide">
                            Backend
                        </h3>
                        <ul className="mt-3 space-y-2">
                            {backendMembers.map((member, idx) => (
                                <li key={idx}>
                                    <a
                                        href={member.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-blue-500 hover:translate-x-1 inline-block transition-all duration-200"
                                    >
                                        {member.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
