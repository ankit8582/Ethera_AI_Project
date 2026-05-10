import { useState, useEffect, useCallback, memo, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { auth, firebaseEnabled } from "./firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Profile from "./Profile";
import {
  authRegister,
  authLogin,
  getProjects,
  createProject as apiCreateProject,
  patchProjectMembers,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function Header() {
    return (
      <header className="header-premium">
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 24px'}}>
          <div className="flex justify-between items-center" style={{height:'68px'}}>
            <div className="flex items-center" style={{gap:'14px'}}>
              <div className="header-logo-glow" style={{fontSize:'32px'}}>📋</div>
              <div>
                <h1 className="header-brand-text" style={{fontSize:'1.4rem',fontWeight:800,letterSpacing:'-0.02em'}}>
                  Team Task Manager
                </h1>
                <p style={{fontSize:'0.72rem',color:'rgba(148,163,184,0.7)',marginTop:'1px',letterSpacing:'0.08em',textTransform:'uppercase'}}>Organize • Collaborate • Achieve</p>
              </div>
            </div>
            <div className="flex items-center" style={{gap:'16px'}}>
              <div style={{textAlign:'right'}}>
                <p style={{fontSize:'0.72rem',color:'rgba(148,163,184,0.6)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Powered by</p>
                <p style={{fontWeight:700,color:'#a5b4fc',fontSize:'0.9rem'}}>Ethera AI</p>
              </div>
              <div style={{width:'38px',height:'38px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 20px rgba(99,102,241,0.5)',fontSize:'0.85rem',fontWeight:800,color:'#fff'}}>EA</div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function Footer() {
    return (
      <footer className="footer-premium" style={{color:'#e2e8f0'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'48px 24px 28px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'40px',marginBottom:'40px'}}>
            <div style={{gridColumn:'span 2'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
                <span style={{fontSize:'28px'}}>📋</span>
                <span style={{fontSize:'1.15rem',fontWeight:800,background:'linear-gradient(135deg,#a5b4fc,#c4b5fd)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Team Task Manager</span>
              </div>
              <p style={{color:'rgba(148,163,184,0.7)',fontSize:'0.88rem',lineHeight:1.7,marginBottom:'20px'}}>
                Streamline your team's productivity with our intuitive task management solution built with React, Firebase, and modern web technologies.
              </p>
              <div style={{display:'flex',gap:'10px'}}>
                {['📘','📷','🐦'].map((icon,i)=>(
                  <div key={i} style={{width:'38px',height:'38px',background:'rgba(99,102,241,0.15)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'18px'}}>{icon}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{fontSize:'0.78rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#a5b4fc',marginBottom:'16px'}}>Features</h4>
              {['Task Management','Team Collaboration','Progress Tracking','Dark Mode'].map((f,i)=>(
                <p key={i} style={{color:'rgba(148,163,184,0.7)',fontSize:'0.88rem',marginBottom:'10px',cursor:'pointer'}}>{f}</p>
              ))}
            </div>
            <div>
              <h4 style={{fontSize:'0.78rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#6ee7b7',marginBottom:'16px'}}>Support</h4>
              {['Help Center','Documentation','Contact Us','Privacy Policy'].map((s,i)=>(
                <p key={i} style={{color:'rgba(148,163,184,0.7)',fontSize:'0.88rem',marginBottom:'10px',cursor:'pointer'}}>{s}</p>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(99,102,241,0.15)',paddingTop:'24px',display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'center',gap:'16px'}}>
            <p style={{color:'rgba(148,163,184,0.5)',fontSize:'0.82rem'}}>© 2026 Ethera AI. All rights reserved. Built with ❤️ using React & Firebase.</p>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{fontSize:'0.78rem',color:'rgba(148,163,184,0.4)'}}>Powered by</span>
              <span style={{fontSize:'0.85rem',fontWeight:700,color:'#a5b4fc'}}>React</span>
              <span style={{color:'rgba(148,163,184,0.3)'}}>•</span>
              <span style={{fontSize:'0.85rem',fontWeight:700,color:'#fb923c'}}>Firebase</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

const ProjectTeamForm = memo(({
  projectName,
  projectDescription,
  memberEmail,
  darkMode,
  selectedProjectId,
  projects,
  onProjectNameChange,
  onProjectDescriptionChange,
  onMemberEmailChange,
  onCreateProject,
  onAddProjectMember,
  onRemoveProjectMember,
  projectNameRef,
  projectDescriptionRef,
  memberEmailRef,
}) => {
  return (
    <div className="section-card">
      <h2 className="heading-purple" style={{fontSize:'1.4rem',fontWeight:800,marginBottom:'20px'}}>🗂️ Project & Team Management</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'12px',marginBottom:'16px'}}>
        <input ref={projectNameRef} type="text" name="projectName" id="projectName"
          autoComplete="off" spellCheck="false" placeholder="Project name"
          value={projectName} onChange={onProjectNameChange} className="input-premium" />
        <input ref={projectDescriptionRef} type="text" name="projectDescription" id="projectDescription"
          autoComplete="off" spellCheck="false" placeholder="Project description"
          value={projectDescription} onChange={onProjectDescriptionChange} className="input-premium" />
        <input ref={memberEmailRef} type="email" name="memberEmail" id="memberEmail"
          autoComplete="off" spellCheck="false" placeholder="Member email to add"
          value={memberEmail} onChange={onMemberEmailChange} className="input-premium" />
      </div>
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
        <button onClick={onCreateProject} className="btn btn-primary" style={{flex:1,minWidth:'160px',padding:'14px'}}>
          🚀 Create Project
        </button>
        <button onClick={() => selectedProjectId && onAddProjectMember(selectedProjectId)} className="btn btn-ghost" style={{flex:1,minWidth:'160px',padding:'14px'}}>
          ➕ Add Member
        </button>
      </div>
      {projects.length > 0 && (
        <div style={{marginTop:'24px',display:'flex',flexDirection:'column',gap:'12px'}}>
          {projects.map((project) => (
            <div key={project._id} style={{padding:'20px',borderRadius:'16px',background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)'}}>
              <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',gap:'12px'}}>
                <div>
                  <h3 style={{fontSize:'1rem',fontWeight:700,color:'#a5b4fc',marginBottom:'4px'}}>{project.name}</h3>
                  <p style={{fontSize:'0.8rem',color:'rgba(148,163,184,0.6)'}}>{project.description || 'No description provided.'}</p>
                  <p style={{fontSize:'0.8rem',color:'rgba(148,163,184,0.5)',marginTop:'2px'}}>Owner: {project.ownerId?.username || 'Unknown'}</p>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px',alignItems:'center'}}>
                  {project.members?.map((member) => (
                    <span key={member._id} className="member-badge">
                      {member.username}
                      {project.ownerId?._id !== member._id && (
                        <button type="button" onClick={() => onRemoveProjectMember(project._id, member.email)}
                          style={{marginLeft:'4px',color:'#fca5a5',background:'none',border:'none',cursor:'pointer',fontSize:'14px',lineHeight:1}}>×</button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.projectName === nextProps.projectName &&
    prevProps.projectDescription === nextProps.projectDescription &&
    prevProps.memberEmail === nextProps.memberEmail &&
    prevProps.darkMode === nextProps.darkMode &&
    prevProps.selectedProjectId === nextProps.selectedProjectId &&
    prevProps.projects === nextProps.projects
  );
});

function LoginPage({
  darkMode,
  notification,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginEmailRef,
  loginPasswordRef,
  loginUser,
}) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginUser(navigate);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Header />
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px'}}>
        {notification && (
          <div className={`notification-toast ${notification.type === 'success' ? 'notification-success' : notification.type === 'warning' ? 'notification-warning' : 'notification-error'}`}>
            <span>{notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : '❌'}</span>
            {notification.message}
          </div>
        )}
        <div className="animate-fade-scale" style={{width:'100%',maxWidth:'460px'}}>
          {/* Logo / Brand */}
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <div style={{fontSize:'48px',marginBottom:'12px'}} className="animate-float">📋</div>
            <h1 style={{fontSize:'2.2rem',fontWeight:900,background:'linear-gradient(135deg,#a5b4fc,#c4b5fd,#67e8f9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:'6px'}}>Welcome Back</h1>
            <p style={{color:'rgba(148,163,184,0.7)',fontSize:'0.9rem'}}>Sign in to your Ethera AI account</p>
          </div>

          {/* Card */}
          <div className="glass-card" style={{padding:'36px'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label className="form-label">Email Address</label>
                <input ref={loginEmailRef} type="email" placeholder="you@example.com"
                  value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                  name="login-email" autoComplete="off" suppressHydrationWarning={true}
                  className="input-premium" />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input ref={loginPasswordRef} type="password" placeholder="••••••••"
                  value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                  name="login-password" autoComplete="off" suppressHydrationWarning={true}
                  className="input-premium" />
              </div>
              <button onClick={handleLogin} className="btn btn-primary" style={{width:'100%',padding:'16px',fontSize:'1rem',marginTop:'8px'}}>
                🚀 Sign In
              </button>
            </div>
            <div style={{marginTop:'24px',textAlign:'center',display:'flex',flexDirection:'column',gap:'10px'}}>
              <p style={{fontSize:'0.875rem',color:'rgba(148,163,184,0.7)'}}>
                New user?{' '}
                <Link to="/register" style={{color:'#a5b4fc',fontWeight:600,textDecoration:'none'}}>Create account →</Link>
              </p>
              <p style={{fontSize:'0.875rem',color:'rgba(148,163,184,0.7)'}}>
                Forgot password?{' '}
                <Link to="/reset-password" style={{color:'#c4b5fd',fontWeight:600,textDecoration:'none'}}>Reset it →</Link>
              </p>
              <p style={{fontSize:'0.75rem',color:'rgba(148,163,184,0.4)',marginTop:'8px'}}>
                Firebase auth is {firebaseEnabled ? '✅ enabled' : '⚠️ not configured'}.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function RegisterPage({
  darkMode,
  notification,
  regUsername,
  setRegUsername,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  regUsernameRef,
  regEmailRef,
  regPasswordRef,
  registerUser,
}) {
  const navigate = useNavigate();

  const handleRegister = async () => {
    await registerUser(navigate);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Header />
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px'}}>
        {notification && (
          <div className={`notification-toast ${notification.type === 'success' ? 'notification-success' : notification.type === 'warning' ? 'notification-warning' : 'notification-error'}`}>
            <span>{notification.type === 'success' ? '✅' : '❌'}</span>
            {notification.message}
          </div>
        )}
        <div className="animate-fade-scale" style={{width:'100%',maxWidth:'460px'}}>
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <div style={{fontSize:'48px',marginBottom:'12px'}} className="animate-float">✨</div>
            <h1 style={{fontSize:'2.2rem',fontWeight:900,background:'linear-gradient(135deg,#c4b5fd,#a5b4fc)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:'6px'}}>Create Account</h1>
            <p style={{color:'rgba(148,163,184,0.7)',fontSize:'0.9rem'}}>Join Ethera AI today</p>
          </div>
          <div className="glass-card" style={{padding:'36px'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label className="form-label">Username</label>
                <input ref={regUsernameRef} type="text" placeholder="yourname"
                  value={regUsername} onChange={(e) => setRegUsername(e.target.value)}
                  name="reg-username" autoComplete="off" suppressHydrationWarning={true}
                  className="input-premium" />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input ref={regEmailRef} type="email" placeholder="you@example.com"
                  value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  name="reg-email" autoComplete="off" suppressHydrationWarning={true}
                  className="input-premium" />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input ref={regPasswordRef} type="password" placeholder="min. 6 characters"
                  value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                  name="reg-password" autoComplete="off" suppressHydrationWarning={true}
                  className="input-premium" />
              </div>
              <button onClick={handleRegister} className="btn btn-primary" style={{width:'100%',padding:'16px',fontSize:'1rem',marginTop:'8px'}}>
                🎉 Create Account
              </button>
            </div>
            <div style={{marginTop:'20px',textAlign:'center'}}>
              <p style={{fontSize:'0.875rem',color:'rgba(148,163,184,0.7)'}}>
                Already have an account?{' '}
                <Link to="/login" style={{color:'#a5b4fc',fontWeight:600,textDecoration:'none'}}>Sign in →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ResetPasswordPage({
  darkMode,
  notification,
  setUsers,
  showNotification,
  resetEmailRef,
  resetPasswordRef,
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    const emailTrim = email.trim().toLowerCase();
    const passwordTrim = newPassword.trim();

    if (!emailTrim) {
      showNotification("Please enter your email.", "error");
      return;
    }

    if (firebaseEnabled) {
      try {
        await sendPasswordResetEmail(auth, emailTrim);
        showNotification("Password reset email sent. Check your inbox.", "success");
        navigate("/login");
        return;
      } catch (error) {
        showNotification(error.message, "error");
        return;
      }
    }

    if (!passwordTrim) {
      showNotification("Please enter a new password.", "error");
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = savedUsers.findIndex((user) => {
      const storedEmail = user.email?.trim().toLowerCase();
      const storedUsername = user.username?.trim().toLowerCase();
      return storedEmail === emailTrim || storedUsername === emailTrim;
    });

    if (userIndex === -1) {
      showNotification("Email not found. Use the email or username you registered with.", "error");
      return;
    }

    savedUsers[userIndex].password = passwordTrim;
    localStorage.setItem("users", JSON.stringify(savedUsers));
    setUsers(savedUsers);
    showNotification("Password updated. Please login with new password.", "success");
    navigate("/login");
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Header />
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 20px'}}>
        {notification && (
          <div className={`notification-toast ${notification.type === 'success' ? 'notification-success' : 'notification-error'}`}>
            <span>{notification.type === 'success' ? '✅' : '❌'}</span>
            {notification.message}
          </div>
        )}
        <div className="animate-fade-scale" style={{width:'100%',maxWidth:'460px'}}>
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <div style={{fontSize:'48px',marginBottom:'12px'}} className="animate-float">🔐</div>
            <h1 style={{fontSize:'2.2rem',fontWeight:900,background:'linear-gradient(135deg,#67e8f9,#a5b4fc)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:'6px'}}>Reset Password</h1>
            <p style={{color:'rgba(148,163,184,0.7)',fontSize:'0.9rem'}}>We'll help you get back in</p>
          </div>
          <div className="glass-card" style={{padding:'36px'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label className="form-label">Registered Email</label>
                <input ref={resetEmailRef} type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  name="reset-email" autoComplete="off" suppressHydrationWarning={true}
                  className="input-premium" />
              </div>
              {!firebaseEnabled && (
                <div>
                  <label className="form-label">New Password</label>
                  <input ref={resetPasswordRef} type="password" placeholder="••••••••"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    name="reset-password" autoComplete="off" suppressHydrationWarning={true}
                    className="input-premium" />
                </div>
              )}
              <button onClick={handleReset} className="btn btn-primary" style={{width:'100%',padding:'16px',fontSize:'1rem',marginTop:'8px'}}>
                {firebaseEnabled ? '📧 Send Reset Email' : '🔑 Set New Password'}
              </button>
            </div>
            <div style={{marginTop:'20px',textAlign:'center'}}>
              <p style={{fontSize:'0.875rem',color:'rgba(148,163,184,0.7)'}}>
                Remembered it?{' '}
                <Link to="/login" style={{color:'#a5b4fc',fontWeight:600,textDecoration:'none'}}>Sign in →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function DashboardPage({
  darkMode,
  notification,
  apiAvailable,
  currentUser,
  tasks,
  totalTasks,
  completedTasks,
  overdueTasks,
  pendingTasks,
  progressPercentage,
  handleTaskChange,
  handleAddTask,
  task,
  category,
  priority,
  dueDate,
  projects,
  selectedProjectId,
  assignedTo,
  handleCategoryChange,
  handlePriorityChange,
  handleDueDateChange,
  handleProjectSelectChange,
  handleAssignedToChange,
  projectName,
  projectDescription,
  memberEmail,
  handleProjectNameChange,
  handleProjectDescriptionChange,
  handleMemberEmailChange,
  createNewProject,
  addProjectMember,
  removeProjectMember,
  projectNameRef,
  projectDescriptionRef,
  memberEmailRef,
  taskInputRef,
  draggedIndex,
  logout,
  setDarkMode,
  setFilter,
  filter,
  search,
  setSearch,
  sortBy,
  setSortBy,
  getSortedTasks,
  handleDragStart,
  handleDragOver,
  handleDrop,
  editTask,
  completeTask,
  deleteTaskItem,
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div style={{flex:1,padding:'24px',maxWidth:'1280px',margin:'0 auto',width:'100%',background:'rgba(5,5,20,0.6)',backdropFilter:'blur(10px)',boxShadow:'0 0 80px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',borderRadius:'0 0 24px 24px',borderTop:'1px solid rgba(99,102,241,0.1)'}}>
        {notification && (
          <div className={`notification-toast ${notification.type === 'success' ? 'notification-success' : notification.type === 'warning' ? 'notification-warning' : 'notification-error'}`}>
            <span>{notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : '❌'}</span>
            {notification.message}
          </div>
        )}
        {!apiAvailable && (
          <div style={{marginBottom:'20px',borderRadius:'14px',background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.3)',padding:'14px 18px',color:'#fcd34d',fontSize:'0.9rem',display:'flex',alignItems:'center',gap:'10px'}}>
            ⚠️ Backend unavailable. Tasks will be saved locally for now.
          </div>
        )}

        {/* Welcome Banner */}
        <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.3) 0%,rgba(139,92,246,0.2) 50%,rgba(6,182,212,0.15) 100%)',border:'1px solid rgba(99,102,241,0.3)',borderRadius:'24px',padding:'28px 32px',marginBottom:'24px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,right:0,width:'200px',height:'200px',background:'radial-gradient(circle,rgba(99,102,241,0.2),transparent)',borderRadius:'50%',transform:'translate(50%,-50%)'}} />
          <div className="flex" style={{justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}}>
            <div>
              <p style={{color:'rgba(148,163,184,0.7)',fontSize:'0.85rem',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>Welcome back</p>
              <h1 style={{fontSize:'2rem',fontWeight:900,color:'#f1f5f9',lineHeight:1.2}}>Hello, <span style={{background:'linear-gradient(135deg,#a5b4fc,#67e8f9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{currentUser.username}</span> 👋</h1>
              <p style={{color:'rgba(148,163,184,0.6)',marginTop:'6px',fontSize:'0.9rem'}}>Here's what's happening with your tasks today.</p>
            </div>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <Link to="/profile" className="btn btn-ghost" style={{padding:'10px 18px',fontSize:'0.85rem'}}>👤 Profile</Link>
              <button onClick={() => setDarkMode(!darkMode)} className="btn btn-ghost" style={{padding:'10px 18px',fontSize:'0.85rem'}}>
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button onClick={() => logout(navigate)} className="btn btn-danger" style={{padding:'10px 18px',fontSize:'0.85rem'}}>🙊 Logout</button>
            </div>
          </div>
        </div>

        {/* Add New Task */}
        <div className="section-card">
          <h2 className="heading-green" style={{fontSize:'1.4rem',fontWeight:800,marginBottom:'20px'}}>➕ Add New Task</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <input ref={taskInputRef} type="text" autoComplete="off" spellCheck="false" name="task-title"
              placeholder="What needs to be done?"
              value={task} onChange={handleTaskChange}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTask(); } }}
              className="input-premium" style={{fontSize:'1.05rem',padding:'16px 20px'}} />
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:'12px'}}>
              <select name="task-category" value={category} onChange={handleCategoryChange} className="input-premium">
                <option>Work</option><option>Personal</option><option>Shopping</option><option>Health</option><option>Learning</option>
              </select>
              <select name="task-priority" value={priority} onChange={handlePriorityChange} className="input-premium">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
              <input name="task-due-date" type="date" value={dueDate} onChange={handleDueDateChange} className="input-premium" />
              <select name="task-project" value={selectedProjectId} onChange={handleProjectSelectChange} className="input-premium">
                <option value="">No project</option>
                {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
              </select>
              <select name="task-assigned-to" value={assignedTo} onChange={handleAssignedToChange} className="input-premium">
                <option value="">Assign to me</option>
                {projects.find((p) => p._id === selectedProjectId)?.members?.map((m) => <option key={m._id} value={m._id}>{m.username}</option>)}
              </select>
            </div>
            <button type="button" onClick={handleAddTask} className="btn btn-success" style={{padding:'16px',fontSize:'1rem',width:'100%'}}>
              ➕ Add Task
            </button>
          </div>
        </div>

        <ProjectTeamForm
          projectName={projectName}
          projectDescription={projectDescription}
          memberEmail={memberEmail}
          darkMode={darkMode}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectNameChange={handleProjectNameChange}
          onProjectDescriptionChange={handleProjectDescriptionChange}
          onMemberEmailChange={handleMemberEmailChange}
          onCreateProject={createNewProject}
          onAddProjectMember={addProjectMember}
          onRemoveProjectMember={removeProjectMember}
          projectNameRef={projectNameRef}
          projectDescriptionRef={projectDescriptionRef}
          memberEmailRef={memberEmailRef}
        />

        {/* Stats */}
        <div className="section-card stagger-children" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'16px',padding:'24px'}}>
          {[
            {label:'User',value:currentUser.username,icon:'👤',cls:'stat-card-total'},
            {label:'Total Tasks',value:totalTasks,icon:'📋',cls:'stat-card-total'},
            {label:'Completed',value:completedTasks,icon:'✅',cls:'stat-card-completed'},
            {label:'Pending',value:pendingTasks,icon:'⏳',cls:'stat-card-pending'},
            {label:'Overdue',value:overdueTasks,icon:'🔴',cls:'stat-card-overdue'},
          ].map((s,i)=>(
            <div key={i} className={`stat-card ${s.cls} animate-fade-up`} style={{animationDelay:`${i*0.07}s`}}>
              <div style={{fontSize:'24px',marginBottom:'8px'}}>{s.icon}</div>
              <p style={{fontSize:'0.75rem',color:'rgba(148,163,184,0.7)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'4px'}}>{s.label}</p>
              <p style={{fontSize:'1.8rem',fontWeight:800,color:'#f1f5f9'}}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="section-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <p style={{fontWeight:600,color:'rgba(148,163,184,0.8)',fontSize:'0.9rem'}}>Task Completion Progress</p>
            <span style={{fontWeight:800,fontSize:'1.1rem',background:'linear-gradient(135deg,#a5b4fc,#67e8f9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{progressPercentage}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{width:`${progressPercentage}%`}} />
          </div>
        </div>

        {/* Task List */}
        <div className="section-card">
          <h2 className="heading-gradient" style={{fontSize:'1.4rem',fontWeight:800,marginBottom:'20px'}}>📌 Your Tasks</h2>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',gap:'12px',marginBottom:'20px'}}>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              <button onClick={() => setFilter("All")} className={`filter-tab ${filter==="All"?"active-all":""}`}>All</button>
              <button onClick={() => setFilter("Completed")} className={`filter-tab ${filter==="Completed"?"active-done":""}`}>✅ Completed</button>
              <button onClick={() => setFilter("Pending")} className={`filter-tab ${filter==="Pending"?"active-pending":""}`}>⏳ Pending</button>
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <input type="text" placeholder="🔍 Search tasks..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                className="input-premium" style={{minWidth:'200px',padding:'10px 14px'}} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-premium" style={{padding:'10px 14px'}}>
                <option>Default</option><option>Priority</option><option>Date</option><option>Category</option><option>Completion</option>
              </select>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div style={{textAlign:'center',padding:'60px 20px',color:'rgba(148,163,184,0.5)'}}>
              <div style={{fontSize:'48px',marginBottom:'16px'}}>📭</div>
              <p style={{fontSize:'1.1rem'}}>No tasks yet. Add your first task above!</p>
            </div>
          ) : getSortedTasks().length === 0 ? (
            <div style={{textAlign:'center',padding:'60px 20px',color:'rgba(148,163,184,0.5)'}}>
              <div style={{fontSize:'48px',marginBottom:'16px'}}>🔍</div>
              <p>No tasks match your filter.</p>
            </div>
          ) : (
            <ul style={{display:'flex',flexDirection:'column',gap:'12px',listStyle:'none',padding:0}}>
              {getSortedTasks().map((item) => {
                const actualIndex = tasks.indexOf(item);
                return (
                  <li key={actualIndex} draggable
                    onDragStart={() => handleDragStart(actualIndex)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(actualIndex)}
                    className={`task-card ${item.completed ? 'completed' : ''} ${draggedIndex === actualIndex ? 'dragging' : ''} animate-fade-up`}
                  >
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
                      <div style={{flex:1,minWidth:'200px'}}>
                        <p style={{fontWeight:600,fontSize:'1rem',color: item.completed ? 'rgba(148,163,184,0.5)' : '#f1f5f9',textDecoration:item.completed?'line-through':'none',marginBottom:'6px'}}>
                          {item.title}
                        </p>
                        <p style={{fontSize:'0.78rem',color:'rgba(148,163,184,0.55)'}}>
                          📁 {item.category} &nbsp;•&nbsp; 📅 {item.dueDate || 'No date'}
                        </p>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                        <span className={`priority-badge ${item.priority==='High'?'priority-high':item.priority==='Medium'?'priority-medium':'priority-low'}`}>
                          {item.priority==='High'?'🔴':item.priority==='Medium'?'🟡':'🟢'} {item.priority}
                        </span>
                        <button onClick={() => editTask(item._id)} className="btn btn-warning" style={{padding:'7px 14px',fontSize:'0.82rem'}}>✏️ Edit</button>
                        <button onClick={() => completeTask(item._id)} className={`btn ${item.completed ? 'btn-ghost' : 'btn-success'}`} style={{padding:'7px 14px',fontSize:'0.82rem'}}>
                          {item.completed ? '↩️ Undo' : '✅ Done'}
                        </button>
                        <button onClick={() => deleteTaskItem(item._id)} className="btn btn-danger" style={{padding:'7px 14px',fontSize:'0.82rem'}}>🗑️</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children, currentUser }) {
  return currentUser ? children : <Navigate to="/login" replace />;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || []);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Work");
  const [filter, setFilter] = useState("All");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [sortBy, setSortBy] = useState("Default");
  const [notification, setNotification] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [priority, setPriority] = useState("High");
  const [dueDate, setDueDate] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Refs to prevent cursor jumping
  const taskInputRef = useRef(null);
  const projectNameRef = useRef(null);
  const projectDescriptionRef = useRef(null);
  const memberEmailRef = useRef(null);
  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const regUsernameRef = useRef(null);
  const regEmailRef = useRef(null);
  const regPasswordRef = useRef(null);
  const resetEmailRef = useRef(null);
  const resetPasswordRef = useRef(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((item) => item.completed).length;
  const overdueTasks = tasks.filter((item) => {
    return !item.completed && item.dueDate && new Date(item.dueDate) < new Date();
  }).length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const storedCurrent = JSON.parse(localStorage.getItem("currentUser"));

    if (storedCurrent) {
      if (storedCurrent.token && storedCurrent.user) {
        setCurrentUser(storedCurrent.user);
        setToken(storedCurrent.token);
        loadTasks(storedCurrent.user.id || storedCurrent.user.uid || storedCurrent.user.username, storedCurrent.token);
        loadProjects(storedCurrent.token);
      } else {
        setCurrentUser(storedCurrent);
        loadTasks(storedCurrent.uid || storedCurrent.username);
      }
    }
  }, []);

  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  async function loadTasks(userId, authToken) {
    try {
      const tasks = await getTasks(userId, authToken);
      setTasks(tasks);
      saveUserTasks(userId, tasks);
      setApiAvailable(true);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setApiAvailable(false);
      const localTasks = loadUserTasks(userId);
      setTasks(localTasks);
      showNotification('Backend unavailable. Loaded tasks from local storage.', 'warning');
    }
  }

  async function loadProjects(authToken) {
    try {
      const loaded = await getProjects(authToken);
      setProjects(loaded);
      if (loaded.length > 0 && !selectedProjectId) {
        setSelectedProjectId(loaded[0]._id);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      setProjects([]);
    }
  }

  const handleTaskChange = useCallback((e) => {
    setTask(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
  }, []);

  const handlePriorityChange = useCallback((e) => {
    setPriority(e.target.value);
  }, []);

  const handleDueDateChange = useCallback((e) => {
    setDueDate(e.target.value);
  }, []);

  const handleProjectSelectChange = useCallback((e) => {
    setSelectedProjectId(e.target.value);
  }, []);

  const handleAssignedToChange = useCallback((e) => {
    setAssignedTo(e.target.value);
  }, []);

  const handleProjectNameChange = useCallback((e) => {
    setProjectName(e.target.value);
  }, []);

  const handleProjectDescriptionChange = useCallback((e) => {
    setProjectDescription(e.target.value);
  }, []);

  const handleMemberEmailChange = useCallback((e) => {
    setMemberEmail(e.target.value);
  }, []);

  const createNewProject = useCallback(async () => {
    if (!projectName.trim()) {
      showNotification('Project name is required.', 'error');
      return;
    }

    try {
      const payload = {
        name: projectName,
        description: projectDescription,
        memberEmails: memberEmail ? [memberEmail.toLowerCase()] : [],
      };
      const newProj = await apiCreateProject(payload, token);
      setProjects((prevProjects) => [...prevProjects, newProj]);
      setProjectName('');
      setProjectDescription('');
      setMemberEmail('');
      setSelectedProjectId(newProj._id);
      showNotification('Project created successfully!', 'success');
    } catch (err) {
      console.error('Error creating project:', err);
      showNotification(err.message || 'Unable to create project.', 'error');
    }
  }, [projectName, projectDescription, memberEmail, token]);

  const addProjectMember = useCallback(async (projectId) => {
    if (!memberEmail.trim()) {
      showNotification('Member email is required.', 'error');
      return;
    }

    try {
      const updated = await patchProjectMembers(projectId, { action: 'add', memberEmail: memberEmail.toLowerCase() }, token);
      setProjects((prevProjects) => prevProjects.map((project) => (project._id === projectId ? updated : project)));
      setMemberEmail('');
      showNotification('Member added successfully!', 'success');
    } catch (err) {
      console.error('Error adding member:', err);
      showNotification(err.message || 'Unable to add member.', 'error');
    }
  }, [memberEmail, token]);

  const removeProjectMember = useCallback(async (projectId, email) => {
    try {
      const updated = await patchProjectMembers(projectId, { action: 'remove', memberEmail: email.toLowerCase() }, token);
      setProjects((prevProjects) => prevProjects.map((project) => (project._id === projectId ? updated : project)));
      showNotification('Member removed successfully!', 'success');
    } catch (err) {
      console.error('Error removing member:', err);
      showNotification(err.message || 'Unable to remove member.', 'error');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      if (token) {
        localStorage.setItem("currentUser", JSON.stringify({ user: currentUser, token }));
      } else {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser, token]);

  const localTasksKey = (userId) => `tasks_${userId}`;

  const saveUserTasks = (userId, tasksToSave) => {
    localStorage.setItem(localTasksKey(userId), JSON.stringify(tasksToSave));
  };

  const loadUserTasks = (userId) => {
    return JSON.parse(localStorage.getItem(localTasksKey(userId))) || [];
  };

  const persistTasks = (userId, tasksToSave) => {
    setTasks(tasksToSave);
    saveUserTasks(userId, tasksToSave);
  };

  const getFirebaseErrorMessage = (error) => {
    const errorCode = error?.code || "";
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please login or use a different email.";
      case "auth/invalid-email":
        return "Invalid email format. Please enter a valid email address.";
      case "auth/weak-password":
        return "Password is too weak. Use at least 6 characters.";
      case "auth/wrong-password":
        return "Invalid email or password. Please try again.";
      case "auth/user-not-found":
        return "No account found with this email. Please register first.";
      case "auth/operation-not-allowed":
        return "Email/Password sign-in is disabled in Firebase Authentication settings.";
      case "auth/network-request-failed":
        return "Network error. Check your internet connection and try again.";
      default:
        return error?.message || "Firebase authentication failed.";
    }
  };

  const registerUser = async (navigate) => {
    const username = regUsername.trim();
    const email = regEmail.trim().toLowerCase();
    const password = regPassword.trim();

    if (!username || !email || !password) {
      showNotification("Please fill all registration fields.", "error");
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (savedUsers.some((user) => user.email === email)) {
      showNotification("Email already registered.", "error");
      return;
    }

    if (firebaseEnabled) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = {
          username,
          email,
          uid: userCredential.user.uid,
        };
        setUsers([...savedUsers, newUser]);
        setCurrentUser(newUser);
        setTasks([]);
        setRegUsername("");
        setRegEmail("");
        setRegPassword("");
        showNotification("Firebase registration successful!", "success");
        navigate("/dashboard");
        return;
      } catch (error) {
        console.error("Firebase register error:", error?.code, error?.message, error);
        showNotification(getFirebaseErrorMessage(error), "error");
        return;
      }
    }

    try {
      const response = await authRegister({ username, email, password, role: 'member' });
      setUsers([...savedUsers, response.user]);
      setCurrentUser(response.user);
      setToken(response.token);
      setTasks([]);
      setProjects([]);
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      await loadTasks(response.user.id, response.token);
      await loadProjects(response.token);
      showNotification("Registration successful! Logged in.", "success");
      navigate("/dashboard");
    } catch (error) {
      showNotification(error.message || "Registration failed.", "error");
    }
  };

  const loginUser = async (navigate) => {
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    if (firebaseEnabled) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = {
          username: email.split("@")[0],
          email: userCredential.user.email,
          uid: userCredential.user.uid,
        };
        setCurrentUser(user);
        loadTasks(user.uid);
        setLoginEmail("");
        setLoginPassword("");
        showNotification(`Welcome back, ${user.username}!`, "success");
        navigate("/dashboard");
        return;
      } catch (error) {
        console.error("Firebase login error:", error?.code, error?.message, error);
        showNotification(getFirebaseErrorMessage(error), "error");
        return;
      }
    }

    try {
      const response = await authLogin({ email, password });
      setCurrentUser(response.user);
      setToken(response.token);
      setLoginEmail("");
      setLoginPassword("");
      await loadTasks(response.user.id, response.token);
      await loadProjects(response.token);
      showNotification(`Welcome back, ${response.user.username}!`, "success");
      navigate("/dashboard");
    } catch (error) {
      showNotification(error.message || "Invalid email or password.", "error");
    }
  };

  const googleLogin = async (navigate) => {
    if (!firebaseEnabled) {
      showNotification("Firebase not configured.", "error");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = {
        username: result.user.displayName || result.user.email.split("@")[0],
        email: result.user.email,
        uid: result.user.uid,
      };
      setCurrentUser(user);
      loadTasks(user.uid);
      showNotification(`Welcome, ${user.username}!`, "success");
      navigate("/dashboard");
    } catch (error) {
      console.error("Firebase Google sign-in error:", error?.code, error?.message, error);
      showNotification(getFirebaseErrorMessage(error), "error");
    }
  };

  const logout = async (navigate) => {
    if (firebaseEnabled) {
      try {
        await signOut(auth);
      } catch (error) {
        console.warn("Firebase logout failed:", error.message);
      }
    }

    setCurrentUser(null);
    setToken(null);
    setTasks([]);
    setProjects([]);
    showNotification("Logged out successfully.", "success");
    navigate("/login");
  };

  const handleAddTask = async () => {
    if (!currentUser) {
      showNotification("Please log in before adding a task.", "error");
      return;
    }

    if (task.trim() === "") return;

    const currentUserId = currentUser.id || currentUser.uid || currentUser.username;
    const assignedUserId = assignedTo || currentUserId;
    const projectId = selectedProjectId || null;

    const newTask = {
      title: task,
      category,
      priority,
      dueDate,
      userId: currentUserId,
      assignedTo: assignedUserId,
      projectId,
    };

    try {
      const createdTask = await createTask(newTask, token);
      setTasks([...tasks, createdTask]);
      setTask("");
      setDueDate("");
      setAssignedTo("");
      showNotification(`Task added to ${category}!`, "success");
      setApiAvailable(true);
    } catch (err) {
      console.error('Error adding task:', err);
      setApiAvailable(false);
      const fallbackTask = {
        _id: `${Date.now()}`,
        title: task,
        category,
        priority,
        dueDate,
        completed: false,
        userId: currentUserId,
        assignedTo: assignedUserId,
        projectId,
        createdAt: new Date().toISOString(),
      };
      const updatedTasks = [...tasks, fallbackTask];
      setTasks(updatedTasks);
      saveUserTasks(currentUserId, updatedTasks);
      setTask("");
      setDueDate("");
      setAssignedTo("");
      showNotification("Task saved locally because backend is unavailable.", "warning");
    }
  };

  const deleteTaskItem = async (id) => {
    const userId = currentUser?.id || currentUser?.uid || currentUser?.username;

    try {
      await deleteTask(id, token);
      const updatedTasks = tasks.filter((t) => t._id !== id);
      setTasks(updatedTasks);
      saveUserTasks(userId, updatedTasks);
      showNotification("Task deleted!", "success");
    } catch {
      const updatedTasks = tasks.filter((t) => t._id !== id);
      persistTasks(userId, updatedTasks);
      showNotification("Task deleted locally because backend is unavailable.", "warning");
    }
  };

  const completeTask = async (id) => {
    const userId = currentUser?.uid || currentUser?.username;
    const taskToUpdate = tasks.find((t) => t._id === id);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    try {
      const serverTask = await updateTask(id, { completed: updatedTask.completed }, token);
      const updatedTasks = tasks.map((t) => (t._id === id ? serverTask : t));
      persistTasks(userId, updatedTasks);
    } catch {
      const updatedTasks = tasks.map((t) => (t._id === id ? updatedTask : t));
      persistTasks(userId, updatedTasks);
      showNotification("Task updated locally because backend is unavailable.", "warning");
    }
  };

  const editTask = async (id) => {
    const userId = currentUser?.uid || currentUser?.username;
    const taskToEdit = tasks.find((t) => t._id === id);
    if (!taskToEdit) return;

    const newText = prompt("Edit your task:", taskToEdit.title);

    if (newText && newText.trim() !== "") {
      const updatedTask = { ...taskToEdit, title: newText };
      try {
        const serverTask = await updateTask(id, { title: newText }, token);
        const updatedTasks = tasks.map((t) => (t._id === id ? serverTask : t));
        persistTasks(userId, updatedTasks);
        showNotification("Task updated!", "success");
      } catch {
        const updatedTasks = tasks.map((t) => (t._id === id ? updatedTask : t));
        persistTasks(userId, updatedTasks);
        showNotification("Task updated locally because backend is unavailable.", "warning");
      }
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...tasks];
    const draggedTask = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedTask);
    setTasks(updated);
    setDraggedIndex(null);
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (filter === "Completed") {
      filtered = filtered.filter((item) => item.completed);
    } else if (filter === "Pending") {
      filtered = filtered.filter((item) => !item.completed);
    }

    return filtered.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
  };

  const getSortedTasks = () => {
    const sorted = [...getFilteredTasks()];

    if (sortBy === "Priority") {
      const order = { High: 0, Medium: 1, Low: 2 };
      sorted.sort((a, b) => order[a.priority] - order[b.priority]);
    } else if (sortBy === "Date") {
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "Category") {
      sorted.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "Completion") {
      sorted.sort((a, b) => a.completed - b.completed);
    }

    return sorted;
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage
          darkMode={darkMode}
          notification={notification}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loginEmailRef={loginEmailRef}
          loginPasswordRef={loginPasswordRef}
          loginUser={loginUser}
          googleLogin={googleLogin}
        />} />
        <Route path="/register" element={currentUser ? <Navigate to="/dashboard" replace /> : <RegisterPage
          darkMode={darkMode}
          notification={notification}
          regUsername={regUsername}
          setRegUsername={setRegUsername}
          regEmail={regEmail}
          setRegEmail={setRegEmail}
          regPassword={regPassword}
          setRegPassword={setRegPassword}
          regUsernameRef={regUsernameRef}
          regEmailRef={regEmailRef}
          regPasswordRef={regPasswordRef}
          registerUser={registerUser}
        />} />
        <Route path="/reset-password" element={currentUser ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage
          darkMode={darkMode}
          notification={notification}
          setUsers={setUsers}
          showNotification={showNotification}
          resetEmailRef={resetEmailRef}
          resetPasswordRef={resetPasswordRef}
        />} />
        <Route path="/dashboard" element={<ProtectedRoute currentUser={currentUser}><DashboardPage
          darkMode={darkMode}
          notification={notification}
          apiAvailable={apiAvailable}
          currentUser={currentUser}
          tasks={tasks}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          overdueTasks={overdueTasks}
          pendingTasks={pendingTasks}
          progressPercentage={progressPercentage}
          handleTaskChange={handleTaskChange}
          handleAddTask={handleAddTask}
          task={task}
          category={category}
          priority={priority}
          dueDate={dueDate}
          projects={projects}
          selectedProjectId={selectedProjectId}
          assignedTo={assignedTo}
          handleCategoryChange={handleCategoryChange}
          handlePriorityChange={handlePriorityChange}
          handleDueDateChange={handleDueDateChange}
          handleProjectSelectChange={handleProjectSelectChange}
          handleAssignedToChange={handleAssignedToChange}
          projectName={projectName}
          projectDescription={projectDescription}
          memberEmail={memberEmail}
          handleProjectNameChange={handleProjectNameChange}
          handleProjectDescriptionChange={handleProjectDescriptionChange}
          handleMemberEmailChange={handleMemberEmailChange}
          createNewProject={createNewProject}
          addProjectMember={addProjectMember}
          removeProjectMember={removeProjectMember}
          projectNameRef={projectNameRef}
          projectDescriptionRef={projectDescriptionRef}
          memberEmailRef={memberEmailRef}
          taskInputRef={taskInputRef}
          draggedIndex={draggedIndex}
          logout={logout}
          setDarkMode={setDarkMode}
          setFilter={setFilter}
          filter={filter}
          setSearch={setSearch}
          search={search}
          sortBy={sortBy}
          setSortBy={setSortBy}
          getSortedTasks={getSortedTasks}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          editTask={editTask}
          completeTask={completeTask}
          deleteTaskItem={deleteTaskItem}
        /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute currentUser={currentUser}><Profile currentUser={currentUser} /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
