import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FileRouter } from '../../shared/constants.js'
import { Upload } from './Upload.js'
import { Uploaded } from './Uploaded.js'
import { Uploading } from './Uploading.js'

export function Entry() {
    return (
        <MemoryRouter>
            <Routes>
                <Route path={FileRouter.upload} element={<Upload />} />
                <Route path={FileRouter.uploading} element={<Uploading />} />
                <Route path={FileRouter.uploaded} element={<Uploaded />} />
                <Route path="*" element={<Navigate replace to={FileRouter.upload} />} />
            </Routes>
        </MemoryRouter>
    )
}
