import React from 'react';

export const RulerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5m-9-12.75V16.5m12-12.75h-15V21h15m-15 0V3.75m15 0h-15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75v.01M7.5 3.75v.01M12 3.75v.01M16.5 21v-.01M7.5 21v-.01M12 21v-.01" />
    </svg>
);