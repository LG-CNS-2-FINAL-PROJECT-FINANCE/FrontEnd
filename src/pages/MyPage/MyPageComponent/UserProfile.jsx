import React from 'react';
import { MdOutlineEmail } from "react-icons/md";
import { IoCalendarNumberSharp } from "react-icons/io5";

const UserProfile = () => {
    return (
        <div className="w-[220px] relative bg-white min-h-screen">
            <img 
                src="/assets/bull.png" 
                alt="Bull" 
                className="absolute object-cover rounded-full shadow-lg"
                style={{ left: '30px', top: '150px', width: '170px', height: '170px' }}
            />
            
            {/* Nickname*/}
            <div 
                className="absolute w-full text-center"
                style={{ top: '340px' }}
            >
                <div className="font-bold text-lg text-gray-800">
                    Nickname
                </div>
            </div>
            
            {/* Account Management Button - Thinner */}
            <button 
                className="absolute bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-800 font-medium py-1 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center text-xs"
                style={{ left: '30px', top: '380px', width: '170px' }}
            >
                계정관리
            </button>
            
            {/* Information Box */}
            <div 
                className="absolute border-2 border-gray-300 rounded-lg p-4 bg-white"
                style={{ left: '30px', top: '450px', width: '170px' }}
            >
                <h3 className="font-bold text-base mb-3 text-gray-800">정보</h3>
                
                {/* Email */}
                <div className="flex items-center mb-3">
                    <MdOutlineEmail className="text-gray-600 mr-2" size={16} />
                    <span className="text-sm text-gray-700">email</span>
                </div>
                
                {/* Age */}
                <div className="flex items-center">
                    <IoCalendarNumberSharp className="text-gray-600 mr-2" size={16} />
                    <span className="text-sm text-gray-700">age</span>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
