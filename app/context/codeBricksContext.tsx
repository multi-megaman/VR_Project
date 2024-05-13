import React, { createContext, useState } from 'react';
import { CodeBrickProps } from '@/app/components/CodeBrick';

interface CodeBricksContextProps {
  brickList: CodeBrickProps[];
  setBrickList: React.Dispatch<React.SetStateAction<CodeBrickProps[]>>;
}

const initialState: CodeBricksContextProps = {
  brickList: [],
  setBrickList: () => {},
};
export const CodeBricksContext = createContext<CodeBricksContextProps>(initialState);