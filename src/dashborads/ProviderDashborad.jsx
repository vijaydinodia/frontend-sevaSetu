import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import API_URL from '../api'
import EditProfileModal from '../components/EditProfileModal'
import Button from '../components/ui/Button'

const ProviderDashborad = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [profile, setProfile] = useState(user)
  const [showEditProfile, setShowEditProfile] = useState(false)

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* profile image circle */}
              <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-[#f8ebe6] bg-zinc-100">
                {profile?.profileImage ? (
                  <img
                    className="h-full w-full object-cover"
                    src={profile.profileImage}
                    alt="profile"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-black text-white">
                    <WorkOutlineOutlinedIcon />
                  </div>
                )}
              </div>

              <div>
                <h1 className="m-0 text-4xl font-semibold text-black">Provider Dashboard</h1>
                <p className="mt-2 text-zinc-600">
                  Welcome, {`${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Provider'}
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => setShowEditProfile(true)}>
              <EditOutlinedIcon fontSize="small" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          onSuccess={(updatedUser) => {
            setProfile(updatedUser)
            setShowEditProfile(false)
          }}
          uploadEndpoint={`${API_URL}/user/upload/image`}
          profileEndpoint={`${API_URL}/user/edit-profile`}
        />
      )}
    </>
  )
}

export default ProviderDashborad
