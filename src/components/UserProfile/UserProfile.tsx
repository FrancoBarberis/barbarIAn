import styles from "./UserProfile.module.css";

const UserProfile : React.FC = () => {
  return (
    <div className={styles.userProfile}>
      <img src="/path/to/avatar.jpg" alt="User Avatar" className={styles.avatar} />
      <h2 className={styles.username}>Username</h2>
    </div>
  );
}

export default UserProfile;