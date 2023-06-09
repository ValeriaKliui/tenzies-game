import { useEffect } from 'react';
import { useState } from 'react'

export const Timer = ({seconds, minutes, children }) => {
       return (<div>
        <p className="time">{children} {minutes}:{seconds}</p>
    </div>)
}