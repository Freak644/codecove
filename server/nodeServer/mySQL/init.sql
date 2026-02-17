/*
===================================
    🗄️database: if not exists;
===================================
*/

CREATE DATABASE IF NOT EXISTS codecove_db;
USE codecove_db;

/*
===================================
  🧑‍💻Create the users table if not exists;
===================================
*/

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) NOT NULL UNIQUE CHECK (LENGTH(username) > 0),
    email VARCHAR(100) NOT NULL UNIQUE CHECK (LENGTH(email) > 0),
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) > 0),
    avatar VARCHAR(255) DEFAULT '/Images/Avtar/default.png',
    bio VARCHAR(100) DEFAULT 'Stay! Ahead, Follow the Revolution',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acStatus BOOLEAN DEFAULT 1,
    follower_count BIGINT DEFAULT 0,
    following_count BIGINT DEFAULT 0,
    private_ac BOOLEAN DEFAULT 0
);

/*
===================================
  🧑‍💻Create session Store table if not exists;
===================================
*/

CREATE TABLE IF NOT EXISTS user_sessions (
  session_id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  id CHAR(36) NOT NULL,
  ip VARCHAR(45),
  country VARCHAR(64),
  region VARCHAR(128),
  city VARCHAR(128),
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  isp VARCHAR(255),
  user_agent TEXT,
  browser VARCHAR(64),
  browser_version VARCHAR(32),
  os VARCHAR(64),
  device_type VARCHAR(64) DEFAULT 'desktop',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (id)
);

/*
 recovery like
*/

CREATE TABLE IF NOT EXISTS validationToken (
  token_id CHAR(36) NOT NULL PRIMARY KEY,
  id CHAR(36) NOT NULL,
  session_id CHAR(36) NOT NULL,
  username CHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  isUsed TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (id)
);


/*
===================================
  🖼️ POST Table
===================================
*/

CREATE TABLE IF NOT EXISTS posts (
  post_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  id CHAR(36) NOT NULL,
  images_url JSON NOT NULL,
  caption TEXT,
  blockCat JSON NOT NULL,
  visibility BOOLEAN DEFAULT 1,
  totalLike BIGINT DEFAULT 0,
  totalComment BIGINT DEFAULT 0,
  totalSave BIGINT DEFAULT 0,
  post_moment VARCHAR(100) NOT NULL,
  canComment BOOLEAN DEFAULT 1,
  likeCount BOOLEAN DEFAULT 1,
  canSave VARCHAR(50) DEFAULT "Everyone",
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (id),
  INDEX idx_feed_visibility_created (visibility, created_at)
);


CREATE TABLE IF NOT EXISTS likes (
  like_id INT AUTO_INCREMENT PRIMARY KEY,
  id CHAR(36) NOT NULL,
  post_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id,id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (id),
  INDEX idx_post_id (post_id)
);

/*
===================================
  🖼️ blocked bad words 
===================================
*/

CREATE TABLE IF NOT EXISTS blocked_words (
  id INT AUTO_INCREMENT PRIMARY KEY,
  word VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL
);

/*
===================================
  🖼️ words data 
===================================
*/


INSERT INTO blocked_words (word, category) VALUES
('idiot', 'Abuse'),
('stupid', 'Abuse'),
('dumb', 'Abuse'),
('fool', 'Abuse'),
('trash', 'Abuse'),
('loser', 'Abuse'),
('moron', 'Abuse'),
('nonsense', 'Abuse'),
('ugly', 'Abuse'),
('pig', 'Abuse'),
('clown', 'Abuse'),
('jerk', 'Abuse'),
('shut up', 'Abuse'),
('nasty', 'Abuse'),
('pathetic', 'Abuse'),
('weak', 'Abuse'),
('useless', 'Abuse'),
('worthless', 'Abuse'),
('bastard', 'Abuse'),
('disgusting', 'Abuse'),
('hate', 'Abuse'),
('hateful', 'Abuse');

INSERT INTO blocked_words (word, category) VALUES
('kill', 'Violence'),
('murder', 'Violence'),
('attack', 'Violence'),
('shoot', 'Violence'),
('stab', 'Violence'),
('blood', 'Violence'),
('knife', 'Violence'),
('gun', 'Violence'),
('explode', 'Violence'),
('bomb', 'Violence'),
('terror', 'Violence'),
('fight', 'Violence'),
('beat', 'Violence'),
('hurt', 'Violence'),
('burn', 'Violence'),
('torture', 'Violence'),
('rape', 'Violence'),
('hang', 'Violence'),
('strangle', 'Violence'),
('assault', 'Violence'),
('dead', 'Violence'),
('death', 'Violence');

INSERT INTO blocked_words (word, category) VALUES
('free money', 'Spam'),
('discount here', 'Spam'),
('click here', 'Spam'),
('earn cash', 'Spam'),
('crypto scam', 'Spam'),
('win prize', 'Spam'),
('lottery win', 'Spam'),
('investment scam', 'Spam'),
('buy now', 'Spam'),
('limited offer', 'Spam'),
('act fast', 'Spam'),
('subscribe now', 'Spam'),
('followers cheap', 'Spam'),
('views cheap', 'Spam'),
('fake followers', 'Spam'),
('giveaway scam', 'Spam'),
('promo code spam', 'Spam'),
('adult webcam', 'Spam'),
('xxx', 'Spam'),
('porn', 'Spam'),
('nsfw', 'Spam');

INSERT INTO blocked_words (word, category) VALUES
('http', 'Link'),
('https', 'Link'),
('www', 'Link'),
('dot com', 'Link'),
('.com', 'Link'),
('.net', 'Link'),
('.org', 'Link'),
('.io', 'Link'),
('.link', 'Link'),
('redirect', 'Link'),
('url', 'Link'),
('click link', 'Link'),
('visit site', 'Link'),
('open link', 'Link'),
('shortlink', 'Link'),
('bit.ly', 'Link'),
('tinyurl', 'Link'),
('go to this link', 'Link');

/*
=========================
      💬Comment table
=========================
*/
CREATE TABLE IF NOT EXISTS comments (
  commentID CHAR(36) PRIMARY KEY DEFAULT(UUID()),
  post_id CHAR(36) NOT NULL,
  id CHAR(36) NOT NULL,
  comment TEXT NOT NULL,
  totalLike BIGINT DEFAULT 0,
  report_count INT DEFAULT 0,
  isAccepted BOOLEAN DEFAULT 0,
  isBlocked BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_user_id (id)
);

CREATE TABLE IF NOT EXISTS commentLikes (
  commentLikeID INT AUTO_INCREMENT PRIMARY KEY,
  post_id CHAR(36) NOT NULL,
  id CHAR(36) NOT NULL,
  commentID CHAR(36) NOT NULL,
  UNIQUE(commentID,id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (commentID) REFERENCES comments(commentID) ON DELETE CASCADE,
  INDEX idx_user_id (id),
  INDEX idx_post_id (post_id)
);

CREATE TABLE IF NOT EXISTS postReports (
  report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  id CHAR(36) NOT NULL,
  post_id CHAR(36) NOT NULL,
  UNIQUE(id,post_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS savePost (
  savePost_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  id CHAR(36) NOT NULL,
  post_id CHAR(36) NOT NULL,
  UNIQUE(id,post_id),
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS commentReports (
  report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  id CHAR(36) NOT NULL,
  post_id CHAR(36) NOT NULL,
  commentID CHAR(36) NOT NULL,
  UNIQUE(id,post_id,commentID),
  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (commentID) REFERENCES comments(commentID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
  achievement_id CHAR(36) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  badge_url VARCHAR(256) NOT NULL,
  ach_mean TEXT NOT NULL,
  conditions JSON NOT NULL,
  difficulty ENUM('easy','medium','hard','legendary') NOT NULL,
  condition_version TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS user_achievements (
  user_achievement_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  id CHAR(36) NOT NULL,
  achievement_id CHAR(36) NOT NULL,
  conditions JSON NOT NULL,
  achieved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_achievement (id, achievement_id)
);




CREATE TABLE IF NOT EXISTS follows (
  follower_id CHAR(36) NOT NULL,
  following_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id,following_id),
  INDEX idx_following (following_id),
  INDEX idx_follower (follower_id)
);


CREATE TABLE IF NOT EXISTS notification (
  notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  recipient_id CHAR(36) NOT NULL,
  actor_id CHAR(36),
  type VARCHAR(50) NOT NULL,
  entity_id CHAR(36) NOT NULL,
  entity_type VARCHAR(30) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recipient_id (recipient_id, created_at DESC)
);