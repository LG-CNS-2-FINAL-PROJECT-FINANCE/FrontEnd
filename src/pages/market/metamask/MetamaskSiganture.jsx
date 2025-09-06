import { ethers } from 'ethers';
import { requestPermitSignature } from '../../../api/BcConnector';

export async function signPermitViaMetamask(projectId, tokenAmount) {
    console.log("signPermitViaMetamask called with:", { projectId, tokenAmount, tokenAmountType: typeof tokenAmount });
    
    // MetaMask 설치 여부 확인
    if (typeof window === 'undefined') {
        throw new Error('브라우저 환경이 아닙니다.');
    }
    
    if (!window.ethereum) {
        throw new Error('메타마스크가 설치되어 있지 않습니다. https://metamask.io 에서 설치해주세요.');
    }


    try {
        await window.ethereum.request({ method: 'eth_accounts' });
    } catch (error) {
        throw new Error('메타마스크에 접근할 수 없습니다. 메타마스크를 활성화해주세요.');
    }

    // 1) 계정 연결 및 주소 획득
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    // 2) 백엔드에서 typed-data 요청
    console.log("Requesting permit signature with:", { projectId, userAddress: signerAddress, tokenAmount });
    
    const data = await requestPermitSignature({
        projectId,
        userAddress: signerAddress,      // ********반드시 실제 서명자 주소 전달
        tokenAmount: Number(tokenAmount), 
    });
    
    console.log("Received typed data:", data);
    
    if (!data?.domain || !data?.types || !data?.message) {
        throw new Error('서명 데이터 스키마가 올바르지 않습니다.');
    }

    // 3) 체인 확인/전환
    const requiredChainId = data.domain.chainId;
    const currentChainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(currentChainIdHex, 16);
    if (currentChainId !== requiredChainId) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x' + requiredChainId.toString(16) }],
            });
        } catch (switchErr) {
            if (switchErr && switchErr.code === 4902) {
                throw new Error(`지갑에 필요한 네트워크가 등록되어 있지 않습니다. chainId=${requiredChainId}`);
            }
            throw new Error(`네트워크 전환 실패: ${switchErr?.message || String(switchErr)}`);
        }
    }

    // 4) EIP-712 서명 (ethers v6)
    console.log("Original message value:", data.message.value, typeof data.message.value);
    console.log("Full message object:", data.message);
    console.log("Types definition:", data.types);
    
    // EIP-712 사인용 데이터로 전환
    let valueForSigning;
    try {
        console.log("Original message value:", data.message.value, typeof data.message.value);
        console.log("Full message object:", data.message);
        console.log("Types definition:", data.types);
        
        // Convert to string first 
        let stringValue = String(data.message.value);
        
        // Remove any decimal points for integer conversion
        if (stringValue.includes('.')) {
            stringValue = stringValue.split('.')[0];
        }
        
        console.log("String value for signing:", stringValue);

        // parseUnits로 변환 -> BIGINT
        try {
            valueForSigning = ethers.parseUnits(stringValue, 0); // 0 decimals = just convert to BigInt
            console.log("Using ethers parseUnits value:", valueForSigning.toString());
        } catch (ethersError) {
            console.log("Ethers parseUnits failed, trying direct conversion:", ethersError.message);
            // Fallback to string if parseUnits fails
            valueForSigning = stringValue;
        }
        
        // Basic validation
        if (Number(stringValue) < 0) {
            throw new Error("Value cannot be negative");
        }
        
    } catch (error) {
        console.error("Value conversion error:", error);
        console.error("Problematic value:", data.message.value);
        throw new Error(`값 변환 실패: ${data.message.value} (${error.message})`);
    }
    
    const messageForSigning = { 
        ...data.message, 
        value: valueForSigning 
    };
    
    console.log("Message for signing:", messageForSigning);
    
    const signatureHex = await signer.signTypedData(data.domain, data.types, messageForSigning);
    const { v, r, s } = ethers.Signature.from(signatureHex);

    // 5) 백엔드/온체인에 전달할 페이로드(문자열/숫자만 사용)
    const signature = {
        v: Number(v),
        r,
        s,
        deadline: data.message.deadline,
        owner: data.message.owner,
        spender: data.message.spender,
        value: data.message.value,               // 문자열(최소단위)
        verifyingContract: data.domain.verifyingContract,
        chainId: data.domain.chainId,
        signerAddress,                           // (검증용) 클라이언트에서 얻은 실제 서명자
    };

    return { signature, typedData: data };
}
