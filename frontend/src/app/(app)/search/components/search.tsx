import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

const search = () => {
    return (
        <div>
            <Label className='sr-only'>Search By Name</Label>
            <Input />
        </div>
    )
}

export default search
