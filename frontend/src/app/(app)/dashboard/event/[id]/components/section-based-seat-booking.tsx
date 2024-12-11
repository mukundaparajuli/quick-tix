import React from 'react';
import Draggable from 'react-draggable';

const Page = () => {
    return (
        <div>
            <Draggable>
                <div className='h-56 w-96 bg-blue-500 text-white flex items-center justify-center border rounded shadow-md cursor-grab'>
                    Drag Me!
                </div>
            </Draggable>
        </div>
    );
};

export default Page;
