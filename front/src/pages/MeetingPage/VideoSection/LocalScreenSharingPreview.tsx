import React, { useRef, useEffect } from 'react'

const LocalScreenSharingPreview: React.FC<{ stream: MediaStream | null}> = ({ stream }) => {
    const localPreviewRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = localPreviewRef.current;
        if (video) {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
            };
        }
    }, [stream]);
    return (
        <div className='local_screen_share_preview'>
            <video muted autoPlay ref={localPreviewRef} />
        </div>
    );
}
export default LocalScreenSharingPreview