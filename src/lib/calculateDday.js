const calculateDday = (ddayNum) => {
    if (ddayNum === undefined || ddayNum === null || ddayNum === '') return '-';
    ddayNum = Number(ddayNum);

    if (ddayNum < 0) return '마감';
    if (ddayNum === 0) return 'Day';
    return `${ddayNum}`;
};

export default calculateDday;