import React from 'react'
import Navbar from '../components/Navbar'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'

const UserDashborad = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              <PersonOutlineOutlinedIcon />
            </div>
            <div>
              <h1 className="m-0 text-4xl font-semibold text-black">User Dashboard</h1>
              <p className="mt-2 text-zinc-600">Welcome user</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDashborad
