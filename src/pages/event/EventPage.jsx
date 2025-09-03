import React from 'react';
import EventCard from './EventCard'; // EventCard 컴포넌트 임포트

const dummyEvents = [
    {
        id: 'e1',
        title: '친구 초대 이벤트',
        date: '2025-08-15 ~ 2025-12-31',
        // location: '서울 한강 공원',
        description: '친구 초대하고 함께 리워드 받자!',
        imageUrl: '/assets/event_1.png',
        status: '진행중',
        link: '#', // 가상의 링크
    },
    {
        id: 'e2',
        title: '신규 가입 이벤트',
        date: '2025-08-01 ~ 추후 공지까지',
        // location: '설악산 국립공원',
        description: '신규가입 축하 이벤트! 지금 가입하면 10만원 지급!! 앱에서 간단 가입',
        imageUrl: '/assets/event_2.png',
        status: '진행중',
        link: '#',
    },
    {
        id: 'e3',
        title: '친구 초대 이벤트',
        date: '2025-09-01 ~ 2025-12-31',
        // location: '시청 광장',
        description: '10명 이상의 친구를 초대하여 함께 리워드를 받고 누리자!',
        imageUrl: '/assets/event_3.png',
        status: '예정',
        link: '#',
    },
    {
        id: 'e4',
        title: '첫 투자 치킨 이벤트',
        date: '2025-07-22',
        // location: '코엑스',
        description: '초대를 통해 치킨을 받아보세요!',
        imageUrl: '/assets/event_4.png',
        status: '진행중',
        link: '#',
    },
    {
        id: 'e5',
        title: 'K-POP 댄스 챌린지',
        date: '2025-07-10',
        location: '온라인 (Zoom)',
        description: '전 세계 K-POP 팬들이 함께 참여하는 온라인 댄스 챌린지입니다. 당신의 춤 실력을 뽐내고 푸짐한 경품도 받으세요!',
        imageUrl: '/assets/event_5.png',
        status: '종료',
        link: '#',
    },
/*    {
        id: 'e6',
        title: '도심 속 힐링 요가 클래스',
        date: '2025-08-25',
        location: '도심 공원 잔디밭',
        description: '바쁜 일상 속에서 잠시 벗어나 몸과 마음을 치유하는 요가 클래스입니다. 누구나 참여 가능합니다.',
        imageUrl: 'https://source.unsplash.com/random/400x300?yoga,park',
        status: '예정',
        link: '#',
    },*/
];


function EventPage() {
    return (
        <div className="container mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">진행중인 이벤트</h1>
            <div className="grid grid-cols-1 gap-6">
                {dummyEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}

export default EventPage;