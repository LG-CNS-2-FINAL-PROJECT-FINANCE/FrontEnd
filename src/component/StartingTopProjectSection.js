import React from 'react';
import ProjectCard from './StartingProjectCard';

function TopProjectsSection() {
    const topProjectsData = [
        { id: 1, name: "프로젝트A", amount: "100,010,200원", progress: 60 },
        { id: 2, name: "프로젝트B", amount: "200,500,000원", progress: 85 },
        { id: 3, name: "프로젝트C", amount: "50,000,000원", progress: 30 },
        { id: 4, name: "프로젝트D", amount: "300,123,456원", progress: 95 },
        { id: 5, name: "프로젝트E", amount: "80,000,000원", progress: 50 },
        { id: 6, name: "프로젝트F", amount: "150,000,000원", progress: 70 },
    ];

    return (
        <div className="w-[900px]">
            <div className="flex items-center mb-4">
                <span className="text-2xl font-bold mr-2">{"<"}</span>
                <span className="text-xl font-bold">TOP 조회수</span>
                <span className="text-2xl font-bold ml-2">{">"}</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {topProjectsData.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}

export default TopProjectsSection;