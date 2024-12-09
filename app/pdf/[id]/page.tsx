"use client"

import '@react-pdf-viewer/core/lib/styles/index.css';
import { useEffect, useState } from 'react';
import PdfViewer from './pdf-viewer';

export default function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [id, setId] = useState<number>(-1)

    useEffect(() => {
        params.then((data) => {
            setId(+data.id)
        })
    }, [])

    return <main>
        {
            id == -1 ? <></> :
                <PdfViewer fileUrl={"../doc.pdf"} initialPage={id} />
        }
    </main>
}