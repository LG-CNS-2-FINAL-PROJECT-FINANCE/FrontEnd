// 금액 포멧팅 유틸 함수 -> 설명을 찾아보니 사용자에게 친숙하게 돈을 보여주기 위한 코드라는데 잘 모르겠음
const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return '-';
    const numAmount = parseFloat(amount.toString()); // Decimal128 호환을 위해 toString() 후 parseFloat()
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(numAmount);
};

export default formatAmount;