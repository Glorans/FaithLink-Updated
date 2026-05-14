import { useState } from "react";
import styles  from "../../styles/Admin/AdminPage.module.css";
import sStyles from "../../styles/Admin/AdminSettings.module.css";

export default function AdminSettings() {
  // ── Admin Profile — seeded from the same localStorage keys Login.jsx writes
  const [profile, setProfile] = useState({
    fullName: localStorage.getItem("fullName") || "System Admin",
    email:    localStorage.getItem("email")    || "admin@faithlink.com",
    role:     localStorage.getItem("role")     || "admin",
  });

  // ── Parish Information
  const [parishName,    setParishName]    = useState("Holy Cross Parish");
  const [contactNumber, setContactNumber] = useState("09336943694");
  const [address,       setAddress]       = useState("1078 Cebu S Rd, Cebu City, 6000 Cebu");

  // ── System Preferences (Notification toggles)
  const [notifBookings, setNotifBookings] = useState(true);
  const [notifDonation, setNotifDonation] = useState(true);
  const [notifStream,   setNotifStream]   = useState(false);

  // ── Account Security (UI only — no backend settings API yet)
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdError, setPwdError] = useState("");

  // ── Save flash feedback
  const [saved, setSaved] = useState("");
  const flash = (key) => { setSaved(key); setTimeout(() => setSaved(""), 2500); };

  const handleSaveProfile = () => {
    if (profile.fullName.trim()) flash("profile");
  };

  const handleSaveParish = () => {
    if (parishName.trim()) flash("parish");
  };

  const handleSavePrefs = () => flash("prefs");

  const handleChangePassword = () => {
    setPwdError("");
    if (!pwd.current || !pwd.next || !pwd.confirm) {
      setPwdError("Please fill in all password fields.");
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setPwdError("New password and confirm password do not match.");
      return;
    }
    if (pwd.next.length < 6) {
      setPwdError("New password must be at least 6 characters.");
      return;
    }
    // UI-only: no API call yet
    setPwd({ current: "", next: "", confirm: "" });
    flash("password");
  };

  const SaveFeedback = ({ section, label = "Save Changes" }) => (
    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
      <button className={sStyles.saveBtn} onClick={() => {
        if (section === "profile")  handleSaveProfile();
        if (section === "parish")   handleSaveParish();
        if (section === "prefs")    handleSavePrefs();
      }}>
        {label}
      </button>
      {saved === section && (
        <span style={{ fontSize: "0.82rem", color: "#16a34a", fontWeight: 600 }}>✓ Saved</span>
      )}
    </div>
  );

  return (
    <div>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>Manage admin profile, parish details, and system preferences</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── 1. Admin Profile ── */}
        <div className={styles.tableCard}>
          <div className={styles.tableCardHeader}>
            <h2 className={styles.tableCardTitle}>Admin Profile</h2>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "4px 0 0" }}>
              Your account information as stored in this session
            </p>
          </div>
          <div className={sStyles.cardBody}>
            <div className={sStyles.grid}>
              <div className={sStyles.field}>
                <label className={sStyles.label}>Full Name</label>
                <input
                  className={sStyles.input}
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className={sStyles.field}>
                <label className={sStyles.label}>Email Address</label>
                <input
                  className={sStyles.input}
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="admin@faithlink.com"
                />
              </div>
              <div className={sStyles.field}>
                <label className={sStyles.label}>Role</label>
                <input
                  className={sStyles.input}
                  value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  disabled
                  style={{ background: "#f8fafc", color: "#64748b", cursor: "not-allowed" }}
                />
              </div>
            </div>
            <SaveFeedback section="profile" />
          </div>
        </div>

        {/* ── 2. Parish Information  +  3. System Preferences side-by-side ── */}
        <div className={sStyles.grid}>

          {/* Parish Information */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <h2 className={styles.tableCardTitle}>Parish Information</h2>
            </div>
            <div className={sStyles.cardBody}>
              {[
                { label: "Parish Name",     val: parishName,    set: setParishName,    type: "text" },
                { label: "Contact Number",  val: contactNumber, set: setContactNumber, type: "text" },
                { label: "Address",         val: address,       set: setAddress,       type: "text" },
              ].map(({ label, val, set, type }) => (
                <div key={label} className={sStyles.field}>
                  <label className={sStyles.label}>{label}</label>
                  <input
                    className={sStyles.input}
                    type={type}
                    value={val}
                    onChange={(e) => set(e.target.value)}
                  />
                </div>
              ))}
              <SaveFeedback section="parish" />
            </div>
          </div>

          {/* System Preferences */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <h2 className={styles.tableCardTitle}>System Preferences</h2>
            </div>
            <div className={sStyles.cardBody}>
              {[
                { label: "New Booking Alerts",     sub: "Notify when a parishioner submits a booking",       val: notifBookings, set: setNotifBookings },
                { label: "Donation Notifications", sub: "Notify when a donation is submitted for review",    val: notifDonation, set: setNotifDonation },
                { label: "Live Stream Alerts",     sub: "Notify before a scheduled stream goes live",        val: notifStream,   set: setNotifStream   },
              ].map(({ label, sub, val, set }) => (
                <div key={label} className={sStyles.toggle}>
                  <div>
                    <p className={sStyles.toggleLabel}>{label}</p>
                    <p className={sStyles.toggleSub}>{sub}</p>
                  </div>
                  <button
                    className={`${sStyles.switch} ${val ? sStyles.switchOn : ""}`}
                    onClick={() => set(!val)}
                    aria-label={`Toggle ${label}`}
                  >
                    <span className={sStyles.switchThumb} />
                  </button>
                </div>
              ))}
              <SaveFeedback section="prefs" label="Save Preferences" />
            </div>
          </div>
        </div>

        {/* ── 4. Account Security ── */}
        <div className={styles.tableCard}>
          <div className={styles.tableCardHeader}>
            <h2 className={styles.tableCardTitle}>Account Security</h2>
            <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "4px 0 0" }}>
              Change your admin account password
            </p>
          </div>
          <div className={sStyles.cardBody}>
            <div className={sStyles.grid}>
              <div className={sStyles.field}>
                <label className={sStyles.label}>Current Password</label>
                <input
                  className={sStyles.input}
                  type="password"
                  value={pwd.current}
                  onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
              </div>
              <div className={sStyles.field}>
                <label className={sStyles.label}>New Password</label>
                <input
                  className={sStyles.input}
                  type="password"
                  value={pwd.next}
                  onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>
              <div className={sStyles.field}>
                <label className={sStyles.label}>Confirm New Password</label>
                <input
                  className={sStyles.input}
                  type="password"
                  value={pwd.confirm}
                  onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {pwdError && (
              <p style={{ marginTop: 8, fontSize: "0.82rem", color: "#dc2626" }}>{pwdError}</p>
            )}

            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
              <button className={sStyles.saveBtn} onClick={handleChangePassword}>
                Update Password
              </button>
              {saved === "password" && (
                <span style={{ fontSize: "0.82rem", color: "#16a34a", fontWeight: 600 }}>
                  ✓ Password updated
                </span>
              )}
            </div>
            <p style={{ marginTop: 10, fontSize: "0.75rem", color: "#94a3b8" }}>
              Password changes are UI-only until the backend settings API is connected.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
