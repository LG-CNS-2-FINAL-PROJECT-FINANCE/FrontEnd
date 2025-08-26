import { useNavigate } from 'react-router-dom';

function RegisterConfirmation({ isOpen, onClose, productTitle }) {
    const navigate = useNavigate();

    const handleConfirm = () => {
        onClose();
        navigate("/");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mb-4">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        성공적으로 등록되었습니다
                    </h2>

                    {productTitle && (
                        <p className="text-gray-600 text-sm mb-6">
                            상품: "{productTitle}"
                        </p>
                    )}

                    {/* Confirm Button */}
                    <button
                        onClick={handleConfirm}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 outline-none"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterConfirmation;
