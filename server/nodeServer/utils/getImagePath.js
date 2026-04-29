import path from 'path'

export const getAvatarPath = (userId) => {
  const a = userId.slice(0, 2);
  const b = userId.slice(2, 4);

  const dir = path.join(process.cwd(), "Images/avatars/original", a, b);
  const filePath = path.join(dir, `${userId}.webp`);

  return { dir, filePath };
};