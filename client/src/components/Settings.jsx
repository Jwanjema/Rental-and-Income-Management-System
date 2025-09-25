import React, { useState, useContext } from 'react';
import { UserContext } from '../context/User.jsx';

const Settings = ({ setTheme }) => {
    const { user, setUser } = useContext(UserContext);
    
    // State for profile form
    const [username, setUsername] = useState(user.username);
    const [currency, setCurrency] = useState(user.currency || 'Ksh');

    // State for password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // Feedback messages
    const [feedback, setFeedback] = useState({ message: '', error: false });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, currency }),
            });
            const updatedUser = await response.json();
            if (response.ok) {
                setUser(updatedUser);
                setFeedback({ message: 'Profile updated successfully!', error: false });
            } else {
                throw new Error(updatedUser.error);
            }
        } catch (err) {
            setFeedback({ message: err.message, error: true });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setFeedback({ message: 'Password changed successfully!', error: false });
                setCurrentPassword('');
                setNewPassword('');
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            setFeedback({ message: err.message, error: true });
        }
    };


    return (
        <div>
            <div className="page-header"><h1>Settings</h1></div>

            {feedback.message && (
                <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px', background: feedback.error ? 'var(--danger-color)' : 'var(--success-color)', color: 'white' }}>
                    {feedback.message}
                </div>
            )}

            <div className="dashboard-widgets">
                <div className="widget">
                    <h3>Profile & Preferences</h3>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Currency Symbol</label>
                            <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                        </div>
                        <button type="submit" className="submit-button">Save Profile</button>
                    </form>
                </div>

                <div className="widget">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="submit-button">Update Password</button>
                    </form>
                </div>
            </div>
             <div className="widget" style={{marginTop: '2rem'}}>
                <h3>Theme Settings</h3>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <button type="button" className="submit-button" onClick={() => setTheme('light')}>Light Theme</button>
                    <button type="button" className="cancel-button" onClick={() => setTheme('dark')}>Dark Theme</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;