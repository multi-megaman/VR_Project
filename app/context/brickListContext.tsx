// BrickListContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { CodeBrickProps } from '@/app/components/CodeBricks/CodeBrick';

interface BrickListContextProps {
    brickList: CodeBrickProps[];
    setBrickList: React.Dispatch<React.SetStateAction<CodeBrickProps[]>>;
    brick2Swap: number[];
    setBrick2Swap: React.Dispatch<React.SetStateAction<number[]>>;
    swapBricks: (index1: number, index2: number) => void;
    addCodeBrick: (newBrick: CodeBrickProps) => void;
    startStop: boolean;
    setStartStop: React.Dispatch<React.SetStateAction<boolean>>;
}

const BrickListContext = createContext<BrickListContextProps | undefined>(undefined);

export const BrickListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [brickList, setBrickList] = useState<CodeBrickProps[]>([]);
    const [brick2Swap, setBrick2Swap] = useState<number[]>([]);
    const [startStop, setStartStop] = useState<boolean>(false);

    // Function to add a new code brick to the brick list
    const addCodeBrick = (newBrick: CodeBrickProps) => {
        if (startStop) {
            return;
        }
        setBrickList((prevBrickList) => [...prevBrickList, newBrick]);
    };

    // Function to swap two bricks in the brick list
    const swapBricks = (index1: number, index2: number) => {
        setBrickList((prevBrickList) => {
            const length = prevBrickList.length;
            const reverseIndex1 = length - 1 - index1;
            const reverseIndex2 = length - 1 - index2;
            console.log("Swapping bricks", prevBrickList[reverseIndex1], prevBrickList[reverseIndex2]);
            const newBrickList = [...prevBrickList];
            [newBrickList[reverseIndex1], newBrickList[reverseIndex2]] = [newBrickList[reverseIndex2], newBrickList[reverseIndex1]];
            return newBrickList;
        });
    };

    return (
        <BrickListContext.Provider value={{ brickList, setBrickList, brick2Swap, setBrick2Swap, swapBricks, addCodeBrick, startStop, setStartStop }}>
            {children}
        </BrickListContext.Provider>
    );
};

export const useBrickList = (): BrickListContextProps => {
    const context = useContext(BrickListContext);
    if (!context) {
        throw new Error('useBrickList must be used within a BrickListProvider');
    }
    return context;
};