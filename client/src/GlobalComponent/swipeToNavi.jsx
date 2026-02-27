import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { UnivuUserInfo } from "../lib/basicUserinfo";


const SWIPE_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 600;

export default function SwipeNavigator({ children }) {
    const username = UnivuUserInfo(stat=>stat.userInfo?.username);
  const location = useLocation();
  const navigate = useNavigate();
    const ROUTES = [
        "/",
        "/Chat",
        "/Commit",
        `/Lab/${username}`
    ];
  const handleDragEnd = (_, info) => {
    const currentIndex = ROUTES.indexOf(location.pathname);
    if (currentIndex === -1) return;

    const isHorizontal =
      Math.abs(info.offset.x) > Math.abs(info.offset.y);

    if (!isHorizontal) return;

    const swipeLeft =
      info.offset.x < -SWIPE_THRESHOLD ||
      info.velocity.x < -VELOCITY_THRESHOLD;

    const swipeRight =
      info.offset.x > SWIPE_THRESHOLD ||
      info.velocity.x > VELOCITY_THRESHOLD;

    if (swipeLeft && currentIndex < ROUTES.length - 1) {
      navigate(ROUTES[currentIndex + 1]);
    }

    if (swipeRight && currentIndex > 0) {
      navigate(ROUTES[currentIndex - 1]);
    }
  };

  return (
    <motion.div
      className="w-full h-full"
      drag="x"
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}