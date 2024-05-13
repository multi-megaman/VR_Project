// BrickList.tsx
import React, { use, useContext, useEffect } from 'react';
import CodeBrick from './CodeBrick';
import { CodeBricksContext } from '@/app/context/codeBricksContext';

const BrickList: React.FC = () => {
  const bricks = useContext(CodeBricksContext);

  //for test
  useEffect(() => {
    bricks.setBrickList([
      { color: 'red', label: 'red', execute: () => console.log('red') },
      { color: 'blue', label: 'blue', execute: () => console.log('blue') },
      { color: 'green', label: 'green', execute: () => console.log('green') },
    ]);
  }, []);
  return (
    <group position={[0,1.2,0]}>
    {[...bricks.brickList].reverse().map((brick, index) => (
      <CodeBrick
        key={index}
        color={brick.color}
        label={brick.label}
        execute={brick.execute}
        position={[0, index / 2, 0]} // Stack bricks on top of each other
      />
    ))}
  </group>
  );
};

export default BrickList;