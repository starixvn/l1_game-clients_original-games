import React from 'react'

export function AccessDenied() {
    return (
        <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You need to be authenticated to play this game.</p>
            <p>Please check your token and try again.</p>
        </div>
    )
} 