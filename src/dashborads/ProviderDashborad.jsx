import React from 'react'
import Navbar from '../components/Navbar'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'

const ProviderDashborad = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              <WorkOutlineOutlinedIcon />
            </div>
            <div>
              <h1 className="m-0 text-4xl font-semibold text-black">Provider Dashboard</h1>
              <p className="mt-2 text-zinc-600">Welcome provider</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProviderDashborad
