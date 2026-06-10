import React from 'react'
import Navbar from '../components/Navbar'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'

const AdminDashborad = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              <AdminPanelSettingsOutlinedIcon />
            </div>
            <div>
              <h1 className="m-0 text-4xl font-semibold text-black">Admin Dashboard</h1>
              <p className="mt-2 text-zinc-600">Welcome admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashborad
