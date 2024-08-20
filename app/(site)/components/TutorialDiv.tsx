import React from 'react';

interface TutorialDivProps {
    imagePath: string;
    text: string;
}

const TutorialDiv: React.FC<TutorialDivProps> = ({ imagePath, text }) => {
    return (
        <div className="flex flex-col items-center max-w-sm rounded-lg backdrop-blur-md">
            <img src={imagePath} alt="Tutorial" className="w-96 h-64 object-cover rounded-lg" />
            <p className="mt-4 text-lg text-center p-2">{text}</p>
        </div>
    );
};

export default TutorialDiv;