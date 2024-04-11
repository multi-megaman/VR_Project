import React, { ReactNode } from 'react';

interface VrButtonProps {
    text: string;
    onClick: () => void;
    children?: ReactNode;
}

const VrButton: React.FC<VrButtonProps> = ({ text, onClick, children, ...otherProps  }) => {
    return (
        <button
            style={{
                backgroundColor: 'pink',
                borderRadius: '50%',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
            }}
            onClick={onClick}
            {...otherProps}
        >
            {children}
            {text}
        </button>
    );
};

export default VrButton;